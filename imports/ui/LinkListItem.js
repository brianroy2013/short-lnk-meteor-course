import React from 'react';
import Clipboard from 'clipboard';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export default class LinkListItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      justCopied: false
    };
  }
  componentDidMount(){
    this.clipboard = new Clipboard(this.refs.copy);

    this.clipboard.on('success', () => {
      this.setState({justCopied: true });
      setTimeout(() => this.setState({justCopied: false }), 1000);
    }).on('error', () => {
      alert('Unable to copy link.  Please manualy copy link.');
    });
  }
  componentWillUnmount(){
    this.clipboard.destroy();
  }
  renderStats(){
    const visitsMessage = this.props.visitedCount === 1 ? 'visit' : 'visits';
    let visitedMessage = null;

    if(typeof this.props.lastVisitedAt === 'number'){
      const momentNow = new moment(this.props.lastVisitedAt);
      visitedMessage = `(visted ${momentNow.fromNow()})`;
    }

    return <p>{this.props.visitedCount} {visitsMessage} {visitedMessage}</p>
  }
  render(){
    return (
      <div className="item">
        <h2>{this.props.url}</h2>
        <div className="item__message">
          <p>{this.props.shortUrl}</p>
          {this.renderStats()}
        </div>

        <a className="button button--pill button--link" href={this.props.shortUrl} target="_blank" >Visit</a>
        <button className="button button--pill" ref="copy" data-clipboard-text={this.props.shortUrl}>
          {this.state.justCopied ? 'Copied' : 'Copy' }
        </button>
        <button className="button button--pill" onClick={() => {
          Meteor.call('links.setVisibilty', this.props._id, !this.props.visible);
        }}>
          {this.props.visible ? "Hide" : "Unhide"}
        </button>
      </div>

    );
  }
}

LinkListItem.propTypes ={
	_id: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  shortUrl: React.PropTypes.string.isRequired,
  userId: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool.isRequired,
  visitedCount: React.PropTypes.number.isRequired,
  lastVisitedAt: React.PropTypes.number
};
