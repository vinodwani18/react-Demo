import React, {useState} from 'react'
export const LENDING_DATA_KEY = 'lendingData';

function LendingForm({setLendingData}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const flushState = () => {
        setName('');
        setDescription('');
        setDate('');
        setTime('');
    }

     const handleSubmit = (e) => {
        e.preventDefault();
        const currentData = {
            name,
            description,
            date,
            time,
        }
        let storedData = localStorage.getItem(LENDING_DATA_KEY);
        if(!storedData) {
            let row = [];
            row.push(currentData);
            localStorage.setItem(LENDING_DATA_KEY, JSON.stringify(row));
        } else {
            storedData = JSON.parse(storedData);
            storedData.push(currentData);
            localStorage.setItem(LENDING_DATA_KEY, JSON.stringify(storedData));
        }
        flushState();
        storedData = JSON.parse(localStorage.getItem(LENDING_DATA_KEY));
        setLendingData(storedData);
    }

    return (
        <div>
            <label>Name (String)</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            <label>Description (String)</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
            <label>Date (Date)</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
            <label>Time (Time)</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
            <button type="submit" onClick={handleSubmit}>Add</button>
        </div>
    )
}
export default LendingForm