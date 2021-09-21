import React, { Component } from "react";
import { Input, Label, Menu, Segment, Grid, GridColumn } from 'semantic-ui-react'
import Details from "./Details";


class RestaurantDetails extends Component {
  constructor(props) {
    super(props);
  }
  state = { activeItem: 'inbox' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    
  render() {
    const { activeItem } = this.state
    if (this.props.restaurantDetails){
      const {restaurantDetails} = this.props;
      let cuisinesArr = restaurantDetails.cuisines.split(",");
      const divStyle = {
        color: 'green',
      };
      const cuisionstyle = {
        color: 'red',
      };
      return (
        <div>
          <Details />
          <Segment>
            <Grid>
              <GridColumn>
          <Menu vertical>
            <Menu.Item
              header
            >
              Quick links
            </Menu.Item>
            <Menu.Item
              name='inbox'
              active={activeItem === 'inbox'}
              onClick={this.handleItemClick}
            >
              <Label color='teal'>1</Label>
              Inbox
            </Menu.Item>

            <Menu.Item
              name='spam'
              active={activeItem === 'spam'}
              onClick={this.handleItemClick}
            >
              <Label>51</Label>
              Spam
            </Menu.Item>

            <Menu.Item
              name='updates'
              active={activeItem === 'updates'}
              onClick={this.handleItemClick}
            >
              <Label>1</Label>
              Updates
            </Menu.Item>
            <Menu.Item>
              <Input icon='search' placeholder='Search mail...' />
            </Menu.Item>
            
            </Menu>
          </GridColumn>
        </Grid>
      </Segment>

          <div className="container">
            <div className="jumbotron restdetails rowmargin">
              <h3 className="name">{restaurantDetails.name}</h3>
              <span className="closebtn rating">{restaurantDetails.user_rating.aggregate_rating}/5</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="container"  >
                <b>PhoneNumber</b>
                <br/><b style={divStyle}>02233956243</b>
                <br/><div className="text-secondary">Table Booking Recomended</div>
              </div>
              <div className="container"  >
                <b>Cuisines</b>
                <div style={cuisionstyle}>{restaurantDetails.cuisines}</div>
              </div>
              <div className="container"  >
                <b>Average Cost</b>
              </div>
            </div>
            <div className="col-md-4">
              <div className="container"  >
                <b>Opening Hour</b>
                  <br/><b>Today 12noon - 1.30PM</b>
                  <div className="text-secondary">
                    <br/><b style={cuisionstyle}>See more</b>
                    <br/>Happy Hours 4:00 PM to 8:0 PM 
                    <br/>(Monday - Saturday)
                  </div>
                </div>
                <b>Address</b>
                <div className="text-secondary">
                  {restaurantDetails.location.address}
                </div>
            </div>
            <div className="col-md-4">
              <b>More Information</b>
              {cuisinesArr.map(cuisine => (
                <div>{cuisine}</div>
               ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
    
  }
}
export default RestaurantDetails;
