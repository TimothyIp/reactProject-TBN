import React from 'react';

class ShowCards extends React.Component {

	componentDidMount() {
		console.log("showcards mounted", this.props.showsList)
	}

	render(){
		return (
			<div className="wrapper">
				<ul>
					<li>ShowCards here..</li>
					{this.props.showsList.map((show,index) => {
						return (
							<li key={`showId-${index}`}>
								<div>
									<img src={show.show.image.medium} alt={show.show.name}/>
									<h2>{show.show.name}</h2>
									<p>{show.show.genres[0]}</p>
									<button></button>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
			)
	}
}

export default ShowCards;