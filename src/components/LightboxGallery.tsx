import React, { Component } from "react";

import StyleInjector, { lightboxStyles } from "./styles";

import Header from "./Header";
import Image from "./Image";
import { ArrowBack, IArrowBackProps } from "./icons";

export interface ILightboxGalleryBaseProps {
  selectedImageId?: string;
  maxWidthLightBox?: string;
  images: Array<{
    /**
     * determine the image that will be shown
     */
    id: string;
    /**
     * main image source
     */
    src: string;
    /**
     * will be used only for zoom mode
     * if not exist, it will use "src"
     */
    srcLarge?: string;
    alt?: string;
    /**
     * used for determine the file name when downloaded
     */
    fileName?: string;
  }>;
  arrowOption?: IArrowBackProps;
  hideDownload?: boolean;
  hideZoom?: boolean;
  showRotate?: boolean;
  imageBackgroundColor?: string;
  lightboxClassName?: string;
  onDownload?: () => void;
}

interface ILightboxGalleryProps extends ILightboxGalleryBaseProps {
  onClose?: () => void;
}

interface ILightboxGalleryState {
  move: { x: number; y: number };
  moveStart?: { x: number; y: number };
  zoomed: boolean;
  rotationDeg: number;
  selectedImageId?: string;
}

export class LightboxGallery extends Component<
  ILightboxGalleryProps,
  ILightboxGalleryState
> {
  contentEl: any;
  state = {
    move: { x: 0, y: 0 },
    moveStart: undefined,
    zoomed: false,
    rotationDeg: 0,
    selectedImageId: this.props.selectedImageId,
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
      // this.props.onClose?.();
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
      images,
      onDownload,
      onClose,
      arrowOption,
      hideDownload,
      hideZoom,
      showRotate,
      imageBackgroundColor = "black",
    } = this.props;

    const { move, zoomed, rotationDeg } = this.state;

    const selectedImageIndexTmp = images.findIndex(
      (img) => img.id === this.state.selectedImageId
    );
    const selectedImageIndex =
      selectedImageIndexTmp < 0 ? 0 : selectedImageIndexTmp;
    const selectedImage = images[selectedImageIndex];

    const disablePrevious = selectedImageIndex === 0;
    const disableNext = images.length === selectedImageIndex + 1;

    const prev = (e: any) => {
      e.stopPropagation();
      this.setState({
        selectedImageId: images[selectedImageIndex - 1].id,
      });
    };

    const next = (e: any) => {
      e.stopPropagation();
      this.setState({
        selectedImageId: images[selectedImageIndex + 1].id,
      });
    };

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
                src={selectedImage.srcLarge ?? selectedImage.src}
                style={{
                  transform: `translate3d(-50%, -50%, 0) translate3d(${move.x}px, ${move.y}px, 0) rotate(${rotationDeg}deg)`,
                  WebkitTransform: `translate3d(-50%, -50%, 0) translate3d(${move.x}px, ${move.y}px, 0) rotate(${rotationDeg}deg)`,
                  MsTransform: `translate3d(-50%, -50%, 0) translate3d(${move.x}px, ${move.y}px, 0) rotate(${rotationDeg}deg)`,
                }}
                handleDoubleClick={this.toggleZoom}
              />
            )}
            {!zoomed && (
              <div
                className="__react_modal_image__with-action-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {!disablePrevious && (
                  <span
                    onClick={prev}
                    className="__react_modal_image__action __react_modal_image__prev_arrow"
                  >
                    <ArrowBack {...arrowOption} />
                  </span>
                )}
                <Image
                  id="react-modal-image-img"
                  className="__react_modal_image__medium_img"
                  src={selectedImage.src}
                  handleDoubleClick={this.toggleZoom}
                  contextMenu={selectedImage.src}
                  style={{
                    transform: `translate3d(-50%, -50%, 0) rotate(${rotationDeg}deg)`,
                    WebkitTransform: `translate3d(-50%, -50%, 0) rotate(${rotationDeg}deg)`,
                    MsTransform: `translate3d(-50%, -50%, 0) rotate(${rotationDeg}deg)`,
                    maxWidth: "50%",
                  }}
                />
                {!disableNext && (
                  <span
                    onClick={next}
                    className="__react_modal_image__action __react_modal_image__next_arrow"
                  >
                    <ArrowBack {...arrowOption} />
                  </span>
                )}
              </div>
            )}
          </div>

          <Header
            image={selectedImage.srcLarge ?? selectedImage.src}
            alt={selectedImage.alt}
            zoomed={zoomed}
            toggleZoom={this.toggleZoom}
            toggleRotate={this.toggleRotate}
            onClose={onClose}
            enableDownload={!hideDownload}
            onDownload={onDownload}
            fileName={selectedImage.fileName}
            enableZoom={!hideZoom}
            enableRotate={!!showRotate}
          />
        </div>
      </div>
    );
  }
}
