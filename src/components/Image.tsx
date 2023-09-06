import React, { Component } from "react";

import { SpinnerIcon } from "./icons";

interface IImageProps {
  contextMenu?: any;
  id: string;
  className: string;
  src: string;
  style: any;
  handleDoubleClick: (e: any) => void;
}

interface IImageState {
  loading: boolean;
}

export default class Image extends Component<IImageProps, IImageState> {
  state = {
    loading: true,
  };

  handleOnLoad = () => {
    this.setState({ loading: false });
  };

  handleOnContextMenu = (event: any) => {
    !this.props.contextMenu && event.preventDefault();
  };

  render() {
    const { id, className, src, style, handleDoubleClick } = this.props;

    return (
      <div>
        {this.state.loading && <SpinnerIcon />}
        <img
          id={id}
          className={className}
          src={src}
          style={style}
          onLoad={this.handleOnLoad}
          onDoubleClick={handleDoubleClick}
          onContextMenu={this.handleOnContextMenu}
        />
      </div>
    );
  }
}
