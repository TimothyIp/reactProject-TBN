import React from 'react';
import ReactDOM from 'react-dom';
import { 
    BrowserRouter as Router, 
    Route, Link, NavLink } from 'react-router-dom';
import { ajax } from 'jquery';
import Navigation from './components/Navigation';
import UserCatalogue from './components/UserCatalogue';
import SearchBar from './components/SearchBar';
import UserSearchedShows from './components/UserSearchedShows';
import Header from './components/Header';
import MainPage from './components/MainPage';
import UserCalendar from './components/UserCalendar';
import moment from 'moment';
import firebase from './firebase';

const dbRef = firebase.database().ref('/usersvault');


class App extends React.Component {
  	constructor(){
  		super();
  		this.handleChange = this.handleChange.bind(this);
      this.searchShows = this.searchShows.bind(this);
      this.addToCollection = this.addToCollection.bind(this);
      this.removeFromCollection = this.removeFromCollection.bind(this);
      this.getUserShowTimes = this.getUserShowTimes.bind(this);
      this.addToCalendar = this.addToCalendar.bind(this);
      this.state = {
        searchedShowsList : [],
        userCollection: [],
        userShowTimes: [],
        futureEpisodes: [],
        events: []
      };
    }

    addToCollection(show) {
      const showsPickedList = Array.from(this.state.userCollection);
      showsPickedList.push(show);
  
      //remove duplicate tv shows
      let showsPicked = showsPickedList.filter( function( item, index, self) {
        return index == self.indexOf(item);
      })

      this.setState({
        userCollection: showsPicked
      }, () => {
        this.getUserShowTimes();
      })

    }

    removeFromCollection(index) {
      const showRemoved = Array.from(this.state.userCollection);
      showRemoved.splice(index,1);
      this.setState({
        userCollection: showRemoved
      }, () => {
        this.getUserShowTimes();
      })
    }

    handleChange(event) {
      this.setState({
        [event.target.name] : event.target.value
      })
    }

    searchShows(e) {
      e.preventDefault();
       const showName = this.state.searchedShows
      
      ajax({
        url:`http://api.tvmaze.com/search/shows`,
        method: "GET",
        dataType: "json",
        data: {
          q: showName
        }
      }).then((res)=> {

        //filter out tv shows with no posters
        let showsWithPoster= [];
        for (let i = 0; i < res.length; i++) {
          if (res[i].show.image) {
            showsWithPoster.push(res[i]);
          }
        }

        this.setState({
          searchedShowsList : showsWithPoster
        })
       
      })

    }

    getUserShowTimes() {
      const showTimesArray = Array.from(this.state.userCollection);
      const showTimesInfo = [];
      const todaysDate = moment().format("llll");

      for (let i = 0; i < showTimesArray.length; i++) {
        ajax({
          url: `http://api.tvmaze.com/shows/${showTimesArray[i].id}/episodes`,
          method: "GET",
          dataType: "json"
        }).then((res) => {
          //Gets only future episodes from todays date
          let futureEpisodeTime = res.filter((episode) => {
            // console.log(moment(episode.airstamp).diff(moment()))
            return moment(episode.airstamp).diff(moment()) > 0
          })
          //Only puts shows with future episodes into calendar
          if (futureEpisodeTime.length > 0) {
            showTimesInfo.push({
            id: showTimesArray[i].id,
            name: showTimesArray[i].name,
            status: showTimesArray[i].status,
            futureEpisodes: futureEpisodeTime
            })
          }
        })
      }

      this.setState({
        futureEpisodes: showTimesInfo
      })
      console.log(this.state.futureEpisodes)
    }

    addToCalendar() {
      let eventList = [];
      let eventArray = Array.from(this.state.futureEpisodes);
      for (let i = 0; i < eventArray.length; i++) {
        for (let j = 0; j < eventArray[i].futureEpisodes.length; j++) {
          eventList.push({
            title: eventArray[i].name,
            start: moment(eventArray[i].futureEpisodes[j].airstamp).format("llll"),
            end: moment(eventArray[i].futureEpisodes[j].airstamp).add(eventArray[i].futureEpisodes[j].runtime, "m").format("llll"),
            desc: eventArray[i].futureEpisodes[j].name,
          })
        }
      }
        this.setState({
          events: eventList
        })
       }

    render() {
        return (
          <Router>
              <div>
                <Header />
                <Navigation />
                <Route exact 
                path="/"
                render={(props) => (
                  <MainPage 
                  handleChange={this.handleChange}
                  searchShows={this.searchShows}
                  searchedShowsList={this.state.searchedShowsList}
                  addToCollection={this.addToCollection}
                  removeFromCollection={this.removeFromCollection}
                  />
                )}
                />
                <Route exact 
                path="/usershows" 
                render={(props) => (
                  <UserCatalogue
                  userCollection={this.state.userCollection}
                  removeFromCollection={this.removeFromCollection}
                  />
                  )}
                />
                <Route exact 
                path="/user-showtimes"
                render= {(props) => (
                  <UserCalendar 
                  userCollection = {this.state.userCollection}
                  futureEpisodes = {this.state.futureEpisodes}
                  getUserShowTimes = {this.getUserShowTimes}
                  addToCalendar = {this.addToCalendar}
                  events = {this.state.events}
                  />
                  )}
                />
              </div>
            </Router>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
