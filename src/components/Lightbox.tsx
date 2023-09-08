import React, { Component } from "react";

import StyleInjector, { lightboxStyles } from "./styles";

import Header from "./Header";
import Image from "./Image";

export interface ILightBoxBaseProps {
  medium?: string;
  large?: string;
  alt?: string;
  hideDownload?: boolean;
  hideZoom?: boolean;
  showRotate?: boolean;
  imageBackgroundColor?: string;
  lightboxClassName?: string;
  onDownload?: () => void;
  fileName?: string;
  maxWidthImageLightBox?: string;
}

interface ILightboxProps extends ILightBoxBaseProps {
  onClose?: () => void;
}

interface ILightboxState {
  move: { x: number; y: number };
  moveStart?: { x: number; y: number };
  zoomed: boolean;
  rotationDeg: number;
}

export class Lightbox extends Component<ILightboxProps, ILightboxState> {
  contentEl: any;
  state = {
    move: { x: 0, y: 0 },
    moveStart: undefined,
    zoomed: false,
    rotationDeg: 0,
  };

  handleKeyDown = (event: any) => {
    // ESC or ENTER closes the modal
    if (event.keyCode === 27 || event.keyCode === 13) {
      this.props?.onClose?.();
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  getCoordinatesIfOverImg = (event: any) => {
    const point = event.changedTouches ? event.changedTouches[0] : event;

    if (point.target.id !== "react-modal-image-img") {
      // the img was not a target of the coordinates
      return;
    }

    const dim = this.contentEl.getBoundingClientRect();
    const x = point.clientX - dim.left;
    const y = point.clientY - dim.top;

    return { x, y };
  };

  handleMouseDownOrTouchStart = (event: any) => {
    event.preventDefault();

    if (event.touches && event.touches.length > 1) {
      // more than one finger, ignored
      return;
    }

    const coords = this.getCoordinatesIfOverImg(event);

    if (!coords) {
      // click outside the img => close modal
      this.props.onClose?.();
    }

    if (!this.state.zoomed) {
      // do not allow drag'n'drop if zoom has not been applied
      return;
    }

    this.setState((prev) => {
      return {
        moveStart: coords
          ? {
              x: coords.x - prev.move.x,
              y: coords.y - prev.move.y,
            }
          : { x: 0, y: 0 },
      };
    });
  };

  handleMouseMoveOrTouchMove = (event: any) => {
    event.preventDefault();

    if (!this.state.zoomed || !this.state.moveStart) {
      // do not allow drag'n'drop if zoom has not been applied
      // or if there has not been a click
      return;
    }

    if (event.touches && event.touches.length > 1) {
      // more than one finger, ignored
      return;
    }

    const coords = this.getCoordinatesIfOverImg(event);

    if (!coords) {
      return;
    }

    this.setState((prev) => {
      return {
        move: {
          x: coords.x - (prev.moveStart?.x ?? 0),
          y: coords.y - (prev.moveStart?.y ?? 0),
        },
      };
    });
  };

  handleMouseUpOrTouchEnd = (_event: any) => {
    this.setState({
      moveStart: undefined,
    });
  };

  toggleZoom = (event: any) => {
    event.preventDefault();
    this.setState((prev) => ({
      zoomed: !prev.zoomed,
      // reset position if zoomed out
      move: prev.zoomed ? { x: 0, y: 0 } : prev.move,
    }));
  };

  toggleRotate = (event: any) => {
    event.preventDefault();

    const { rotationDeg } = this.state;

    if (rotationDeg === 360) {
      this.setState({ rotationDeg: 90 });
      return;
    }

    this.setState((prevState) => ({
      rotationDeg: prevState.rotationDeg + 90,
    }));
  };

  render() {
    const {
      lightboxClassName,
      medium,
      large,
      alt,
      fileName,
      onDownload,
      onClose,
      hideDownload,
      hideZoom,
      showRotate,
      imageBackgroundColor = "black",
      maxWidthImageLightBox,
    } = this.props;
    const { move, zoomed, rotationDeg } = this.state;

    return (
      <div className={lightboxClassName || ""}>
        <StyleInjector
          name="__react_modal_image__lightbox"
          css={lightboxStyles({ imageBackgroundColor })}
        />

        <div className="__react_modal_image__modal_container">
          <div
            className="__react_modal_image__modal_content"
            onMouseDown={this.handleMouseDownOrTouchStart}
            onMouseUp={this.handleMouseUpOrTouchEnd}
            onMouseMove={this.handleMouseMoveOrTouchMove}
            onTouchStart={this.handleMouseDownOrTouchStart}
            onTouchEnd={this.handleMouseUpOrTouchEnd}
            onTouchMove={this.handleMouseMoveOrTouchMove}
            ref={(el) => {
              this.contentEl = el;
            }}
          >
            {zoomed && (
              <Image
                id="react-modal-image-img"
                className="__react_modal_image__large_img"
                src={large || medium || ""}
                style={{
                  transform: `translate3d(-50%, -50%, 0) translate3d(${move.x}px, ${move.y}px, 0) rotate(${rotationDeg}deg)`,
                  WebkitTransform: `translate3d(-50%, -50%, 0) translate3d(${move.x}px, ${move.y}px, 0) rotate(${rotationDeg}deg)`,
                  MsTransform: `translate3d(-50%, -50%, 0) translate3d(${move.x}px, ${move.y}px, 0) rotate(${rotationDeg}deg)`,
                }}
                handleDoubleClick={this.toggleZoom}
              />
            )}
            {!zoomed && (
              <Image
                id="react-modal-image-img"
                className="__react_modal_image__medium_img"
                src={medium || large || ""}
                handleDoubleClick={this.toggleZoom}
                contextMenu={!medium}
                style={{
                  transform: `translate3d(-50%, -50%, 0) rotate(${rotationDeg}deg)`,
                  WebkitTransform: `translate3d(-50%, -50%, 0) rotate(${rotationDeg}deg)`,
                  MsTransform: `translate3d(-50%, -50%, 0) rotate(${rotationDeg}deg)`,
                  maxWidth: maxWidthImageLightBox ?? "",
                }}
              />
            )}
          </div>

          <Header
            image={large || medium}
            alt={alt}
            zoomed={zoomed}
            toggleZoom={this.toggleZoom}
            toggleRotate={this.toggleRotate}
            onClose={onClose}
            enableDownload={!hideDownload}
            onDownload={onDownload}
            fileName={fileName}
            enableZoom={!hideZoom}
            enableRotate={!!showRotate}
          />
        </div>
      </div>
    );
  }
}
