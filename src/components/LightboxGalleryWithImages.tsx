import React, { Component } from "react";

import { ILightboxGalleryBaseProps, LightboxGallery } from "./LightboxGallery";

interface LightboxGalleryWithImagesProps extends ILightboxGalleryBaseProps {
  fixedWith?: string;
  className?: string;
}

interface LightboxGalleryWithImagesState {
  selectedImageId?: string;
}

export class LightboxGalleryWithImages extends Component<
  LightboxGalleryWithImagesProps,
  LightboxGalleryWithImagesState
> {
  state = { selectedImageId: "" };

  toggleModal = (selectedImageId: string) => () => {
    this.setState({
      selectedImageId: selectedImageId,
    });
  };

  render() {
    const {
      className,
      fixedWith,
      images,
      hideDownload,
      hideZoom,
      showRotate,
      imageBackgroundColor,
      onDownload,
    } = this.props;

    const { selectedImageId } = this.state;

    return (
      <div id="__react-modal-image-gallery">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {images.map((img) => {
            return (
              <img
                key={img.id}
                className={className}
                style={
                  fixedWith
                    ? {
                        cursor: "pointer",
                        width: fixedWith,
                        height: fixedWith,
                        objectFit: "cover",
                      }
                    : {
                        cursor: "pointer",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }
                }
                onClick={this.toggleModal(img.id)}
                src={img.src}
                alt={img.alt}
              />
            );
          })}
        </div>

        {selectedImageId && (
          <LightboxGallery
            images={images}
            selectedImageId={selectedImageId}
            arrowOption={{
              color: "#FFFFFF",
              size: 32,
            }}
            onDownload={onDownload}
            onClose={this.toggleModal("")}
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
