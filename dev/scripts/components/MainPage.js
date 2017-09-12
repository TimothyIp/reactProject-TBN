import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import ShowCards from './ShowCards';
import Introduction from './Introduction';

class MainPage extends React.Component {

	render() {
		return(
			<div className="mainpage__container">
					<div className="introduction__container">
						<Introduction />
						<SearchBar 
						handleChange= {this.props.handleChange}
						searchShows= {this.props.searchShows}
						/>
					</div>
				<ShowCards
				searchedShowsList= {this.props.searchedShowsList}
				addToCollection= {this.props.addToCollection}
				removeFromCollection={this.props.removeFromCollection}
				user = {this.props.user}
				 />
			</div>
			)
	}
}

export default MainPage;