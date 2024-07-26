import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const Home: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#282c34",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Poster & Additional Information
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
          <Viewer
            fileUrl="/OMNI_Joseph_Quinn_07_19_2024.pdf"
            defaultScale={0.4}
            theme="dark"
          />
        </Worker>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2>Batch Size</h2>
        <p>
          Influences the amount of data processed in parallel during each
          training iteration.
        </p>

        <h2>Patch Size</h2>
        <p>
          Determines the spatial resolution at which the input image is divided
          into smaller segments (patches). Larger patch sizes capture more
          global context but may lose fine-grained details, while smaller patch
          sizes enhance local detail but may require more patches and thus more
          computational resources.
        </p>

        <h2>Model Size</h2>
        <p>
          <strong>Processor Blocks:</strong> The number of transformer layers
          (or blocks) determines the depth and complexity of the model's
          hierarchical feature extraction and contextual understanding.
        </p>

        <p>
          <strong>Embedding Dimension:</strong> Refers to the dimensionality of
          the input embeddings, specifically the size of each patch inputted
          into the model. A higher embedding dimension allows for a better
          representation of the data, potentially capturing more detailed and
          nuanced features. However, it also increases computational demands.
        </p>

        <p>
          <strong>Number of Heads:</strong> Determines how many parallel
          attention mechanisms operate within each transformer block. More heads
          can enhance the model's ability to focus on diverse aspects of the
          input, facilitating better feature extraction and representation
          learning.
        </p>
      </div>
    </div>
  );
};

export default Home;
