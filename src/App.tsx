import React from 'react';
import logo from './logo.svg';
import './App.css';
import AddMessage from './components/AddMessage';
import ListMessages from './components/ListMessages';

function App(): JSX.Element {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload. FOO
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
                <AddMessage />
                <ListMessages />
            </header>
        </div>
    );
}

export default App;
