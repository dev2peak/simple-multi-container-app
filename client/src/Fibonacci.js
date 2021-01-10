import React, { Component } from 'react';
import axios from 'axios';

class Fibonacci extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        console.log('<Client:componentDidMount> called ...');
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get('/api/fib/current');
        this.setState({ values : values.data });

        console.log('<Client:fetchValues> Showing state.values: ' + this.state.values);
    }

    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/fib/values');
        this.setState({ seenIndexes : seenIndexes.data });

        console.log('<Client:fetchIndexes> Showing state.seenIndexes: ' + this.state.seenIndexes);
    }

    listSeenIndexes() {
        console.log('<Client:listSeenIndexes> listSeenIndexes called, and using: ' + this.state.seenIndexes);
        return this.state.seenIndexes.map(({ number }) => number ).join(', ');
    }

    listValues() { 
        console.log('<Client:listValues> listValues called ...');
        const entries = [];

        for(let key in this.state.values) {
            entries.push(
                <div key={key}>
                    Index {key} - Value {this.state.values[key]}
                </div>
            );
        }

        console.log('<Client:listValues> state values: ' + JSON.stringify(this.state.values));

        return entries;
    }

    handleFormSubmit = async (event) => {
        event.preventDefault(); 

        console.log('Submit: ' + this.state.index);
        await axios.post('/api/fib/values', {
            index : this.state.index
        });

        // reset to empty
        this.setState( { index : '' });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>Enter your index: </label>
                    <input 
                        value={this.state.index}
                        onChange={ (event) => this.setState({ index : event.target.value })}/>
                    <button>Submit</button>
                </form>
                <h3>Seen Index</h3>
                {this.listSeenIndexes()}

                <h3>Recent Values</h3>
                {this.listValues()}

            </div>
        );
    }
}

export default Fibonacci;
