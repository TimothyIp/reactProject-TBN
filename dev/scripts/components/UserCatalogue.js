import React from 'react';
import ShowCards from './ShowCards';
class UserCatalogue extends React.Component {
	render(){
		return (
			<div>
				<h1>User Catalogue Component</h1>
				<ShowCards 
				userCollection={this.props.userCollection}
				removeFromCollection={this.props.removeFromCollection}
				/>
			</div>
			)
	}
}

export default UserCatalogue;