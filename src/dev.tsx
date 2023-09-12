import React from "react";
import { LightboxWithImage, LightboxGalleryWithImages } from "./index";
import { createRoot } from "react-dom/client";

const Demo = () => (
  <div>
    <h1>Demo of react-modal-images</h1>

    <h2>#1 with alt, small, medium and large props</h2>

    <div>
      <LightboxWithImage
        alt="Here is the caption"
        onDownload={() => console.log("download the image")}
        fileName="Custom File Name.jpg"
        small="assets/example_img_small.jpg"
        medium="assets/example_img_medium.jpg"
        large="assets/example_img_large.jpg"
      />
    </div>
    <p>^ click or inspect the image above</p>

    <h2>#2 with small and large props defined only</h2>

    <div>
      <LightboxWithImage
        small="assets/example_img_small.jpg"
        large="assets/example_img_large.jpg"
      />
    </div>
    <p>^ click or inspect the image above</p>

    <h2>#3 with small and medium props defined only</h2>

    <div>
      <LightboxWithImage
        small="assets/example_img_small.jpg"
        medium="assets/example_img_medium.jpg"
      />
    </div>
    <p>^ click or inspect the image above</p>

    <h2>#4 with download and zoom -buttons hidden</h2>

    <div>
      <LightboxWithImage
        small="assets/example_img_small.jpg"
        large="assets/example_img_large.jpg"
        hideDownload={true}
        hideZoom={true}
      />
    </div>
    <p>^ click or inspect the image above</p>

    <h2>#5 with transparent png shown in hotpink background</h2>

    <div>
      <LightboxWithImage
        small="example_transparent_heart.png"
        large="example_transparent_heart.png"
        hideDownload={true}
        hideZoom={true}
        imageBackgroundColor="hotpink"
      />
    </div>
    <p>^ click or inspect the image above</p>

    <h2>#6 with rotation -button displayed</h2>

    <div>
      <LightboxWithImage
        small="assets/example_img_small.jpg"
        large="assets/example_img_large.jpg"
        showRotate={true}
      />
    </div>
    <p>^ click or inspect the image above</p>

    <h2>#7 with images from external domain</h2>

    <div>
      <LightboxWithImage
        small="https://dummyimage.com/420x200/000/aaa"
        large="https://dummyimage.com/640x360/000/aaa"
      />
    </div>

    <h2>#8 with multiple images from external domain</h2>

    <div>
      <LightboxGalleryWithImages
        fixedWith="200px"
        maxWidthLightBox="80%"
        images={[
          {
            id: "https://dummyimage.com/420x200/000/aaa",
            src: "https://dummyimage.com/420x200/000/aaa",
            fileName: "image-1.jpg",
            alt: "image-1",
          },
          {
            id: "assets/example_img_large.jpg",
            src: "assets/example_img_large.jpg",
            srcLarge: "assets/example_img_large.jpg",
          },
          {
            id: "https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189",
            src: "https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189",
            fileName:
              "https://cdn.glitch.com/4c9ebeb9-8b9a-4adc-ad0a-238d9ae00bb5%2Fmdn_logo-only_color.svg?1535749917189",
            alt: "test",
          },
        ]}
      />
    </div>

    <h2>Further info</h2>

    <p>
      <a href="https://github.com/didikmulyadi/react-modal-images">Github</a>
    </p>
  </div>
);

const container = document.getElementById("root");
if (container) {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload()
  );
  const root = createRoot(container);
  root.render(<Demo />);
}
