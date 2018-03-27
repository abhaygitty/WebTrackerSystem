/*
  Usage Example
 <div className="row-action-group" >
   <div className="row-action-left" >
     <ActionIconButton
     type="edit"
     to={editTo}
     link={Link}
     onClick={this.handleEditClick}
     />
   </div>
   <div className="row-action-left" >
     <ActionIconButton
       type="delete"
       to={deleteTo}
       link={Link}
       onClick={this.handleDeleteClick}
      />
   </div>
 </div>
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import AvLibraryAdd from 'material-ui/svg-icons/av/library-add';
import EditLocation from 'material-ui/svg-icons/maps/edit-location';
import ContactMail from 'material-ui/svg-icons/communication/contact-mail';
import ViewModule from 'material-ui/svg-icons/action/view-module';
import ViewJob from 'material-ui/svg-icons/av/playlist-add-check';
import ViewFee from 'material-ui/svg-icons/editor/attach-money';
import ViewRevision from 'material-ui/svg-icons/action/track-changes';
import ViewEDI from 'material-ui/svg-icons/communication/vpn-key';
import ViewRemoteInfo from 'material-ui/svg-icons/action/settings-input-antenna';
import BackIcon from 'material-ui/svg-icons/hardware/keyboard-backspace';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';

class ActionIconButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation(); // prevent parent node event
    const { onClick, id } = this.props;
    if (onClick) {
      onClick(id);
    }
  }

  render() {
    const style = Object.assign({
      opacity: 0.64,
      display: 'flex',
      alignItems: 'left',
    }, this.props.style);

    const props = {
      ...this.props,
      style,
    };

    // delete props.to;
    // delete props.link;
    delete props.iconType;

    // const Link = this.props.link;
    const iconType = this.props.iconType;

    let Icon = (<ModeEditIcon
      onClick={this.handleClick}
    />);
    switch(iconType) {
      case 'add':
        Icon = (<AvLibraryAdd
          onClick={this.handleClick}
          />);
        break;
      case 'delete':
        Icon = (<DeleteIcon
          onClick={this.handleClick}
        />);
        break;
      case 'back':
        Icon = (<BackIcon
          onClick={this.handleClick}
        />);
        break;
      case 'location':
        Icon = (<EditLocation
          onClick={this.handleClick}
        />);
        break;
      case 'contact':
        Icon = (<ContactMail
          onClick={this.handleClick}
        />);
        break;
      case 'module':
        Icon = (<ViewModule
          onClick={this.handleClick}
        />);
        break;
      case 'job':
        Icon = (<ViewJob
          onClick={this.handleClick}
        />);
        break;
      case 'fee':
        Icon = (<ViewFee
          onClick={this.handleClick}
        />);
        break;
      case 'revision':
        Icon = (<ViewRevision
          onClick={this.handleClick}
        />);
        break;
      case 'support':
        Icon = (<ViewRemoteInfo
          onClick={this.handleClick}
        />);
        break;
      case 'edi':
        Icon = (<ViewEDI
          onClick={this.handleClick}
        />);
        break;
      case 'arrowback':
        Icon = (<ArrowBack
          onClick={this.handleClick}
        />);
        break;
      case 'arrowforward':
        Icon = (<ArrowForward
          onClick={this.handleClick}
        />);
        break;
      default:
    }

    // console.log('this.props.tooltip', this.props.tooltip);
    /*
    return (
      <Link to={this.props.to}>
        <IconButton {...props}>
          {Icon}
        </IconButton>
      </Link>
    );
    */

    /* Implementation */
    /*
     <ActionIconButton
     type="edit"
     to={updateTo}
     link={Link}
     tooltip="General Detail"
     onClick={this.handleEditClick}
     />
     */

    return (
      <IconButton {...props}>
        {Icon}
      </IconButton>
    );
  }
}

ActionIconButton.propTypes = {
  ...IconButton.propTypes,
  // id: PropTypes.number.isRequired,
  iconType: PropTypes.string.isRequired,
  // to: PropTypes.string,
  // link: PropTypes.func,
  onClick: PropTypes.func,
};

export default ActionIconButton;
