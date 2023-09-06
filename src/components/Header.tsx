import React from "react";

import {
  ZoomInIcon,
  ZoomOutIcon,
  DownloadIcon,
  CloseIcon,
  RotateIcon,
} from "./icons";

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
      const link = document.createElement("a");
      link.href = href;
      link.download = name || href.split("/").slice(-1)[0];

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      event.preventDefault();
      onDownload?.();
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
