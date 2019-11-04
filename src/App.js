import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import './App.css';
import Navbar from "./Components/layout/Navbar"
import Users from "./Components/Users/Users"
import User from "./Components/Users/User"
import Search from "./Components/Users/Search"
import Alert from "./Components/layout/Alert"
import About from "./Components/pages/About"
import axios from 'axios'

class App extends React.Component {
  state = {
    users:[],
    user: {},
    loading: false,
    alert: null,
    repos: []
  }

  // Search Github users
  searchUsers = async (text) => {
    this.setState({loading: true})

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({
      users:res.data.items,
      loading: false,
      alert: null
    })
  }

  // get single Github user
  getUser = async (username) => {
    this.setState({loading: true})

    const res = await axios.get(`https://api.github.com/users/${username}?client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({
      user: res.data,
      loading: false,
    })
  }

  //Get users repos
  getUserRepos = async (username) => {
    this.setState({loading: true})

    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({
      repos: res.data,
      loading: false,
    })
  }

  // Clear Users from state
  clearUsers = () => this.setState({ users: [], loading: false})

  // Set Alert
  setAlert = (msg, type) => {
    this.setState({alert: {msg, type}});
    setTimeout(() => {this.setState({alert: null})}, 5000);
  }

  render(){
    const {users, user, repos, loading} = this.state
    return (
      <Router>
        <div className = "App">
          <Navbar title="Github Finder" icon="fab fa-github" />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route exact path='/' render={props => (
                <React.Fragment>
                  <Search searchUsers={this.searchUsers} clearUsers={this.clearUsers} 
                  showClear={users.length > 0 ? true: false}
                  setAlert={this.setAlert}/>
                  <Users loading={loading} users={users} />
                </React.Fragment>
              )}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/user/:login' render={props => (
                <User 
                  {...props} 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos}
                  user={user}
                  repos={repos} 
                  loading={loading}/>
              )} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  } 
}

export default App;
