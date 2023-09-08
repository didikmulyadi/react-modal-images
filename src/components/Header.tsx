import React from "react";

import {
  ZoomInIcon,
  ZoomOutIcon,
  DownloadIcon,
  CloseIcon,
  RotateIcon,
} from "./icons";

function isSameOrigin(href: string) {
  if (!href.includes("http")) {
    return true;
  }

  return document.location.hostname !== new URL(href).hostname;
}

const Header = ({
  image,
  fileName,
  alt,
  zoomed,
  toggleZoom,
  toggleRotate,
  onClose,
  onDownload,
  enableDownload,
  enableZoom,
  enableRotate,
}: any) => {
  /**
   * Triggers image download
   */
  const download =
    (href: string, name = null) =>
    (event: any) => {
      event.preventDefault();
      const fileName = name || href.split("/").slice(-1)[0];

      const createAnchor = (_href: string, target = "") => {
        const tmpAnchor = document.createElement("a");
        tmpAnchor.setAttribute("download", fileName);
        tmpAnchor.setAttribute("href", _href);
        tmpAnchor.setAttribute("target", target);

        return tmpAnchor;
      };

      const clickAnchor = (tmpAnchor: HTMLAnchorElement) => {
        document.body.appendChild(tmpAnchor);
        tmpAnchor.click();
        document.body.removeChild(tmpAnchor);
        onDownload?.();
      };

      if (!isSameOrigin(href)) {
        const tmpAnchor = createAnchor(href);
        clickAnchor(tmpAnchor);
        return;
      }

      fetch(href)
        .then((res) => {
          if (!res.ok) {
            clickAnchor(createAnchor(href, "_blank"));
          }

          return res.blob().then((blob) => {
            clickAnchor(createAnchor(URL.createObjectURL(blob), "_blank"));
          });
        })
        .catch((err) => {
          console.error(err);
          console.error("Failed to download image from " + href);
          clickAnchor(createAnchor(href, "_blank"));
        });
    };

  return (
    <div className="__react_modal_image__header">
      <span className="__react_modal_image__icon_menu">
        {enableDownload && (
          <a href={image} download onClick={download(image, fileName)}>
            <DownloadIcon />
          </a>
        )}
        {enableZoom && (
          <a onClick={toggleZoom}>
            {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
          </a>
        )}
        {enableRotate && (
          <a onClick={toggleRotate}>
            <RotateIcon />
          </a>
        )}
        <a onClick={onClose}>
          <CloseIcon />
        </a>
      </span>
      {alt && <span className="__react_modal_image__caption">{alt}</span>}
    </div>
  );
};

export default Header;
