import React from 'react';
import { 
    BrowserRouter as Router, 
    Route, Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';

class Header extends React.Component {
	render() {
		return(
			<div className={`header ${this.props.mainContentSlide}`}>
				<div onClick={this.props.navBarToggle} className="menu">
				  <div className={`menu__line ${this.props.navBar}`}></div>
				</div>
				<div className={`header__search ${this.props.searchHeaderStatus}`}>
					<SearchBar 
					handleChange={this.props.handleChange}
					searchShows={this.props.searchShows}
					/>
				</div>
				{this.props.user ?
				   null
				   :
				   <div className='user__warning'>
				     <p>You must be logged in to save your collections.</p>
				   </div>
				 }
				{this.props.user ?
				    <button onClick={this.props.logout}>Log Out</button>
				    :
				    <button onClick={this.props.login}>Log In</button>
				  }
			</div>
			)
	}
}

export default Header;