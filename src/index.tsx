import React, { Component } from "react";

import Lightbox, { ILightBoxBaseProps } from "./components/Lightbox";

export { default as Lightbox } from "./components/Lightbox";

interface LightBoxWithImageProps extends ILightBoxBaseProps {
  className?: string;
  small: string;
  smallSrcSet?: string;
}

interface LightBoxWithImageState {
  modalOpen: boolean;
}

export class LightBoxWithImage extends Component<
  LightBoxWithImageProps,
  LightBoxWithImageState
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
