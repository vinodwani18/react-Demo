/**
 * Copyright (c) 2019 Dell Inc., or its subsidiaries. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

import React, {ReactNode} from "react";

import osintl from "i18N/i18nUtils";
import {
    CONTAINS_OPERATOR,
    DATAGRID_COLUMN_WIDTH,
    DetailsForRefetch,
    EQUAL_OPERATOR,
    FilterColumn,
    FOOTER,
    MutationActions,
    PAGE_INDEX,
    PAGE_OFFSET,
    PAGE_SIZE,
    SortColumn,
    SortDirection,
} from "common/utils/constants";
import {NONE_TEMPLATE} from "configure/objectStores/common/utils/constants";
import {
    createFilter,
    edgeNodeNotEmpty,
    getPageOffset,
    getUpdatedRowsOnRowSelect,
    getUpdatedRowsOnRowSelectAll,
    isRowSelected,
} from "common/utils/utils";

import {createRefetchContainer, RelayRefetchProp} from "react-relay";
import {graphql} from "babel-plugin-relay/macro";

import {
    DataGrid,
    DataGridColumn,
    DataGridFilter,
    DataGridFilterResult,
    DataGridRow,
    GridSelectionType,
    SortOrder,
} from "@dellstorage/clarity-react/datagrid";

import {ObjectStoreBucketActions} from "./ObjectStoreBucketActions";
import {ObjectStoreSectionNames} from "../ObjectStoreDetails";
import {ErrorAlert} from "common/components/ErrorAlert";
import {Select, SelectOption} from "@dellstorage/clarity-react/forms/select/Select";

import "./ObjectStoreBuckets.scss";
import {ObjectStoreBuckets_bucketDetails} from "./__generated__/ObjectStoreBuckets_bucketDetails.graphql";
import {ObjectStoreBuckets_tenantList} from "./__generated__/ObjectStoreBuckets_tenantList.graphql";
import FeatureEnablerService, {Features} from "common/services/FeatureEnablerService";

/**
 * General component description :
 * ObjectStoreBucketList : Displays lists of buckets for an object store
 * and allows operations like create, delete, edit on buckets
 */

// i18N messages
const nameCol = osintl.intl.formatMessage({id: "commonLabel.name"});
const policyCol = osintl.intl.formatMessage({id: "objectStore.details.buckets.policy"});
const ownerCol = osintl.intl.formatMessage({id: "objectStore.details.buckets.owner"});
const buckets = osintl.intl.formatMessage({id: "objectStore.details.buckets"});
const encryption = osintl.intl.formatMessage({id: "objectStore.details.buckets.encryption"});
const id = osintl.intl.formatMessage({id: "objectStore.details.buckets.id"});
const yes = osintl.intl.formatMessage({id: "objectStore.details.buckets.yes"});
const no = osintl.intl.formatMessage({id: "objectStore.details.buckets.no"});
const policyData = osintl.intl.formatMessage({id: "objectStore.details.buckets.policyData"});
const genericError = osintl.intl.formatMessage({id: "app.genericError"});
const accountLabel = osintl.intl.formatMessage({id: "objectStore.details.buckets.account"});

const ID_FIELD: string = "id";

//Quality engineering field
export const dataqa_bucket_datagrid = "configure_objectstores_details_bucket_datagrid";
export const ObjectStoreBucketID = "objectstore_bucket_list";

// Mapping for UI column names and GaphQL field names for buckets sorting
export enum ObjectStoreBucketsColumns {
    nameCol = "name",
    ownerCol = "owner",
    policyCol = "policy",
}

type BucketObjectStore = {
    name: string;
    namespace: string;
    tenants: {
        edges: {
            node: {
                tenantID: string;
            };
        }[];
    };
};

export type Tenant = {
    id: string;
    tenantID: string;
};

/**
 * @param {relay} - Relay pagination prop
 * @param {viewerNamespace} - namespace selected from namespace dropdown
 * @param {onToggle} - toggle between bucket list and bucket summary
 * @param {onTenantChange} - change handler when tenant change
 * @param {objectStore} - selected ObjectStore
 * @param {bucketDetails} - tenants and bucket list from object store
 * @param {selectedTenant} - selected tenant
 */
type ObjectStoreBucketProps = {
    relay: RelayRefetchProp;
    viewerNamespace: string;
    onToggle: (activeDetailsPage: ObjectStoreSectionNames, bucketName: string) => void;
    onTenantChange: (evt?: React.ChangeEvent<HTMLSelectElement>, overrideTenant?: Tenant) => void;
    objectStore: BucketObjectStore;
    bucketDetails?: ObjectStoreBuckets_bucketDetails;
    tenantList?: ObjectStoreBuckets_tenantList;
    selectedTenant: Tenant | undefined;
};

/**
 * State for bucket component :
 * @params {error} error String to represent if the mutation or query failed
 * @params {selectedDataGridRows} list of selected rows
 * @params {isLoading} boolean value to showloading
 */
type ObjectStoreBucketsState = {
    error: string | null;
    selectedDataGridRows: DataGridRow[];
    isLoading: boolean;
};

/**
 * Component for object store buckets
 */
class ObjectStoreBuckets extends React.PureComponent<ObjectStoreBucketProps, ObjectStoreBucketsState> {
    private objectStoreBucketRef = React.createRef<DataGrid>();
    private objStoreBucketActionsRef = React.createRef<ObjectStoreBucketActions>();
    private nameFilter: FilterColumn | null;
    private sort: SortColumn | null;
    private pageIndex: number;

    state: ObjectStoreBucketsState = {
        error: null,
        selectedDataGridRows: [],
        isLoading: false,
    };

    constructor(props: ObjectStoreBucketProps) {
        super(props);
        this.nameFilter = null;
        this.sort = null;
        this.pageIndex = PAGE_INDEX;
        const tenant =
            this.props.tenantList &&
            this.props.tenantList.tenantsData &&
            this.props.tenantList.tenantsData.edges &&
            this.props.tenantList.tenantsData.edges.length > 0 &&
            this.props.tenantList.tenantsData.edges[0] &&
            this.props.tenantList.tenantsData.edges[0].node &&
            this.props.tenantList.tenantsData.edges[0].node;

        if (tenant) {
            const defaultTenant: Tenant = {
                id: tenant.id,
                tenantID: tenant.tenantID ? tenant.tenantID : "",
            };
            this.props.onTenantChange(undefined, defaultTenant);
        }
    }

    /**
     * Function to populate column values for bucket list
     */
    private populateColumnData = (): DataGridColumn[] => {
        const columnValues: DataGridColumn[] = [
            {
                columnName: nameCol,
                width: DATAGRID_COLUMN_WIDTH,
                sort: {defaultSortOrder: SortOrder.NONE, sortFunction: this.sortBuckets},
                filter: (
                    <DataGridFilter
                        onFilter={this.filterBuckets}
                        columnName={nameCol}
                        datagridRef={this.objectStoreBucketRef}
                        debounce={true}
                    />
                ),
            },
            {
                columnName: policyCol,
                width: DATAGRID_COLUMN_WIDTH,
            },
            {
                columnName: ownerCol,
                sort: {defaultSortOrder: SortOrder.NONE, sortFunction: this.sortBuckets},
                width: DATAGRID_COLUMN_WIDTH,
            },
            {
                columnName: encryption,
                isVisible: false,
            },
            {
                columnName: id,
                isVisible: false,
            },
            {
                columnName: policyData,
                isVisible: false,
            },
        ];
        return columnValues;
    };

    /**
     * Get the edges data from GrpahQL
     **/
    private getBucketEdges = () => {
        const {bucketDetails} = this.props;
        return bucketDetails &&
            bucketDetails.tenants &&
            bucketDetails.tenants.edges &&
            bucketDetails.tenants.edges[0] &&
            bucketDetails.tenants.edges[0].node &&
            bucketDetails.tenants.edges[0].node.buckets &&
            bucketDetails.tenants.edges[0].node.buckets.edges
            ? bucketDetails.tenants.edges[0].node.buckets.edges
            : undefined;
    };

    /**
     * @param action - values from MutationActions
     */
    private static getErrorMessage() {
        return genericError;
    }

    /**
     * Resetting the errors array
     * UpdateStore Method to trigger refetch
     */
    private handleStoreUpdate = async (shouldStoreUpdate: boolean, action: string, errors?: string[]) => {
        if (errors) {
            // Hide loader on datagrid and enable all actions
            this.setState({
                error: ObjectStoreBuckets.getErrorMessage() + ": " + errors.toString(),
                isLoading: false,
            });

            this.objStoreBucketActionsRef.current!.disableAllBucketsActions(false);
        }

        if (shouldStoreUpdate) {
            // On successful mutation completion, empty the selected rows in state
            this.updateState(true, []);

            await this.refetchBuckets({
                offset: getPageOffset(this.pageIndex, PAGE_SIZE),
                action: action,
            });
        }
    };

    /**
     * Update parent component to show/hide object stores bucket list or summary
     */
    onToggle = (bucketName: string) => {
        this.props.onToggle(ObjectStoreSectionNames.BUCKETS, bucketName);
    };

    /**
     * Function to populate row values for bucket list from props
     */
    private populateRowData = () => {
        let rowValues = new Array<DataGridRow>();
        const edges = this.getBucketEdges();

        if (edges) {
            edges
                .filter((edge: any) => edge && edge.node)
                .forEach(({node}: any) => {
                    const row: DataGridRow = {
                        isSelected: isRowSelected(this.state.selectedDataGridRows, node.id, ID_FIELD),
                        rowData: [
                            {
                                cellDisplayData: FeatureEnablerService.isFeatureEnabled(Features.BUCKETS_V2) ? (
                                    <span
                                        onClick={event => this.onToggle(node.name)}
                                        className="objectstorebucket-name-link"
                                    >
                                        {node.name}
                                    </span>
                                ) : (
                                    node.name
                                ),
                                cellData: node.name,
                                columnName: nameCol,
                            },
                            {
                                cellData:
                                    node.policy === JSON.stringify(NONE_TEMPLATE) || node.policy === "null" ? no : yes,
                                columnName: policyCol,
                            },
                            {
                                cellData: node.owner && node.owner.toLocaleLowerCase(),
                                columnName: ownerCol,
                            },
                            {
                                cellData: node.encryptionEnabled,
                                columnName: encryption,
                            },
                            {
                                cellData: node.id,
                                columnName: id,
                            },
                            {
                                cellData: node.policy,
                                columnName: policyData,
                            },
                        ],
                    };
                    rowValues.push(row);
                });
        }
        return rowValues;
    };

    /**
     * Update the state with the selected rows
     */
    private updateState = (isUpdated: boolean, selectedDataGridRows: DataGridRow[]) => {
        if (isUpdated) {
            this.setState(
                prevState => ({
                    ...prevState,
                    selectedDataGridRows,
                }),
                () => {
                    this.objStoreBucketActionsRef.current!.updateActions(this.state.selectedDataGridRows);
                },
            );
        }
    };
    /**
     * Function to set the selected rows and enable/disable
     * action buttons
     */
    private selectRowCallback = (row?: DataGridRow) => {
        if (row) {
            const {isUpdated, selectedDataGridRows} = getUpdatedRowsOnRowSelect(
                row,
                ID_FIELD,
                this.state.selectedDataGridRows,
            );
            this.updateState(isUpdated, selectedDataGridRows);
        }
    };

    /**
     * Function to set the selected rows and enable/disable
     * action buttons
     */
    private selectAllCallback = (allSelected?: boolean) => {
        let allRowsInAPage: DataGridRow[] = this.populateRowData();

        const {isUpdated, selectedDataGridRows} = getUpdatedRowsOnRowSelectAll(
            allSelected ? allSelected : false,
            allRowsInAPage,
            this.state.selectedDataGridRows,
            ID_FIELD,
        );
        this.updateState(isUpdated, selectedDataGridRows);
    };

    /**
     * Get total count for buckets
     */
    private getCount = () => {
        const {bucketDetails} = this.props;
        return bucketDetails &&
            bucketDetails.tenants &&
            bucketDetails.tenants.edges &&
            bucketDetails.tenants.edges[0] &&
            bucketDetails.tenants.edges[0].node &&
            bucketDetails.tenants.edges[0].node.buckets &&
            bucketDetails.tenants.edges[0].node.buckets.counts &&
            bucketDetails.tenants.edges[0].node.buckets.counts.total
            ? bucketDetails.tenants.edges[0].node.buckets.counts.total
            : 0;
    };

    /**
     * Function to get data for single page
     */
    getPageData = (pageIndex: number, pageSize: number): Promise<DataGridRow[]> => {
        this.pageIndex = pageIndex;
        return this.refetchBuckets({offset: getPageOffset(this.pageIndex, pageSize)});
    };

    /**
     * Function to sort objectStore buckets list
     */
    sortBuckets = (rows: DataGridRow[], sortOrder: SortOrder, columnName: string): Promise<DataGridRow[]> => {
        let field: string = "";
        let direction: SortDirection = sortOrder === SortOrder.DESC ? SortDirection.DESC : SortDirection.ASC;

        switch (columnName) {
            case nameCol:
                field = ObjectStoreBucketsColumns.nameCol;
                break;
            case ownerCol:
                field = ObjectStoreBucketsColumns.ownerCol;
                break;
        }

        this.sort = {
            field: field,
            direction: direction,
        };
        return this.refetchBuckets({offset: getPageOffset(this.pageIndex, PAGE_SIZE)});
    };

    /*
     * Function to return updated row values aftering filtering
     * to the datagrid component
     */
    private filterBuckets = (
        rows: DataGridRow[],
        columnValue: any,
        columnName: string,
    ): Promise<DataGridFilterResult> => {
        if (columnName === nameCol) {
            this.nameFilter = createFilter(columnValue, CONTAINS_OPERATOR);
        }
        //clear the selections on filter as per vmware clarity
        if (this.state.selectedDataGridRows.length !== 0) {
            this.updateState(true, []);
        }
        return this.refetchBuckets({offset: PAGE_OFFSET, isFiltering: true});
    };

    /**
     * Relay code to refetch data after filtering and pagination
     * @param {offset} offset value for pagination it will be always 0 for filtering
     * @param {isFiltering} if false the function will return data
     * of type DataGridRow[] else of type DataGridFilterResult
     */
    refetchBuckets = ({offset, isFiltering, action}: DetailsForRefetch): Promise<any> => {
        return new Promise((resolve, reject) => {
            const {relay, viewerNamespace, selectedTenant} = this.props;
            this.setState({isLoading: true});
            const bucketTenantIDFilter = selectedTenant ? createFilter(selectedTenant.tenantID, EQUAL_OPERATOR) : {};

            relay.refetch(
                {
                    bucketOffset: offset,
                    bucketSort: this.sort,
                    bucketName: this.nameFilter,
                    viewerNamespace: viewerNamespace,
                    bucketTenantID: bucketTenantIDFilter,
                },
                undefined,
                error => {
                    const rows = this.populateRowData();
                    // In case of pagination pass total items if filtering is null
                    let totalItems = this.getCount();

                    /* For pagination the result type will be DataGridRow[]
                    and for filtering it shoule be DataGridFilterResult */
                    let result: DataGridFilterResult | DataGridRow[] = [];

                    if (isFiltering) {
                        result = {
                            rows: rows,
                            totalItems: totalItems,
                        };
                    } else {
                        result = rows;

                        if (action && action === MutationActions.DELETE && rows.length === 0 && this.pageIndex !== 1) {
                            // If all rows in current page gets deleted then fetch previous page data
                            this.pageIndex = this.pageIndex - 1;
                            this.refetchBuckets({
                                offset: getPageOffset(this.pageIndex, PAGE_SIZE),
                                action: action,
                            });
                        }
                    }

                    // Hide loader on datagrid and enable actions
                    this.setState({isLoading: false});
                    this.objStoreBucketActionsRef.current!.disableAllBucketsActions(false);

                    resolve(result);
                },
                {force: true},
            );
        });
    };

    private static tenantOption({
        node: {id, tenantID},
    }: {
        node: {id: string; tenantID: string; alias?: string};
    }): ReactNode {
        const tenant: Tenant = {
            id: id,
            tenantID: tenantID,
        };

        return (
            <SelectOption key={tenantID} value={JSON.stringify(tenant)}>
                {tenantID}
            </SelectOption>
        );
    }

    render() {
        const {tenantList, objectStore, onTenantChange, selectedTenant} = this.props;
        const {error, isLoading} = this.state;
        return (
            <div className="grid-div">
                {error && <ErrorAlert error={error} parent={this} closeable={true} />}
                <div key="action-container" className="action-container">
                    {objectStore.name && objectStore.namespace && (
                        <ObjectStoreBucketActions
                            ref={this.objStoreBucketActionsRef}
                            objectStoreName={objectStore.name}
                            objectStoreNamespace={objectStore.namespace}
                            onStoreUpdate={this.handleStoreUpdate}
                            bucketDataGridRef={this.objectStoreBucketRef}
                            selectedTenantID={selectedTenant ? selectedTenant.id : ""}
                        />
                    )}
                    {tenantList && tenantList.tenantsData && tenantList.tenantsData.edges && (
                        <Select
                            key="account-select"
                            label={accountLabel}
                            onChange={onTenantChange}
                            defaultValue={selectedTenant ? selectedTenant.tenantID : ""}
                        >
                            {tenantList.tenantsData.edges
                                .filter(edgeNodeNotEmpty)
                                // @ts-ignore // empty nodes filtered by statement above
                                .map(ObjectStoreBuckets.tenantOption)}
                        </Select>
                    )}
                </div>
                <DataGrid
                    key="bucket-grid"
                    id={ObjectStoreBucketID}
                    ref={this.objectStoreBucketRef}
                    className="datagrid-buckets-max-height"
                    columns={this.populateColumnData()}
                    rows={this.populateRowData()}
                    selectionType={GridSelectionType.MULTI}
                    dataqa={dataqa_bucket_datagrid}
                    selectedRowCount={this.state.selectedDataGridRows.length}
                    onRowSelect={this.selectRowCallback}
                    onSelectAll={this.selectAllCallback}
                    footer={FOOTER}
                    itemText={buckets}
                    isLoading={isLoading}
                    pagination={{
                        totalItems: this.getCount(),
                        getPageData: this.getPageData,
                        pageSize: PAGE_SIZE,
                    }}
                />
            </div>
        );
    }
}

export const ObjectStoreBucketsRefetchQuery = graphql`
    query ObjectStoreBucketsRefetchQuery(
        $count: Int
        $name: FilterStringArgument
        $viewerNamespace: String!
        $bucketOffset: Int
        $bucketSort: BucketSort
        $bucketName: FilterStringArgument
        $bucketTenantID: FilterStringArgument
        $tenantIDSet: Boolean!
    ) {
        viewer(namespace: $viewerNamespace) {
            objectStores(first: $count, name: $name) @connection(key: "ObjectStoreDetails_objectStores") {
                edges {
                    node {
                        ...ObjectStoreBuckets_bucketDetails @include(if: $tenantIDSet)
                        ...ObjectStoreBuckets_tenantList
                    }
                }
            }
        }
    }
`;

// GraphQL and Relay code for List of buckets
export default createRefetchContainer(
    ObjectStoreBuckets,
    {
        bucketDetails: graphql`
            fragment ObjectStoreBuckets_bucketDetails on ObjectStore {
                name
                namespace
                tenants(first: 100, tenantID: $bucketTenantID) @connection(key: "ObjectStoreBuckets_tenants") {
                    edges {
                        node {
                            id
                            tenantID
                            buckets(first: $count, offset: $bucketOffset, sort: $bucketSort, name: $bucketName)
                                @connection(key: "ObjectStoreBuckets_buckets") {
                                counts {
                                    total
                                }
                                edges {
                                    node {
                                        id
                                        name
                                        owner
                                        policy
                                        encryptionEnabled
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        tenantList: graphql`
            fragment ObjectStoreBuckets_tenantList on ObjectStore {
                name
                namespace
                tenantsData: tenants(first: 100) @connection(key: "ObjectStoreBuckets_tenantsData") {
                    edges {
                        node {
                            id
                            tenantID
                        }
                    }
                }
            }
        `,
    },
    ObjectStoreBucketsRefetchQuery,
);