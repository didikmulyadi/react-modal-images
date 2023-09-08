import React, { Component } from "react";

import { Lightbox, ILightBoxBaseProps } from "./Lightbox";

interface LightboxWithImageProps extends ILightBoxBaseProps {
  className?: string;
  small: string;
  smallSrcSet?: string;
}

interface LightboxWithImageState {
  modalOpen: boolean;
}

export class LightboxWithImage extends Component<
  LightboxWithImageProps,
  LightboxWithImageState
> {
  state = { modalOpen: false };

  toggleModal = () => {
    this.setState((prev) => ({
      modalOpen: !prev.modalOpen,
    }));
  };

  render() {
    const {
      className,
      lightboxClassName,
      small,
      smallSrcSet,
      medium,
      large,
      alt,
      hideDownload,
      hideZoom,
      showRotate,
      imageBackgroundColor,
      onDownload,
      fileName,
    } = this.props;
    const { modalOpen } = this.state;

    return (
      <div>
        <img
          className={className}
          style={{
            cursor: "pointer",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          onClick={this.toggleModal}
          src={small}
          srcSet={smallSrcSet}
          alt={alt}
        />
        {modalOpen && (
          <Lightbox
            lightboxClassName={lightboxClassName}
            medium={medium}
            large={large}
            alt={alt}
            fileName={fileName}
            onDownload={onDownload}
            onClose={this.toggleModal}
            hideDownload={hideDownload}
            hideZoom={hideZoom}
            showRotate={showRotate}
            imageBackgroundColor={imageBackgroundColor}
          />
        )}
      </div>
    );
  }
}
