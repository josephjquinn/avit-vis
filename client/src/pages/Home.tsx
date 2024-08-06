import React from "react";
import "./Home.css"; // Import the CSS file

const PDFViewer: React.FC = () => {
  return (
    <div className="pdf-viewer-container">
      <h1 className="pdf-viewer-header">
        Poster & Additional Information
      </h1>

      <div className="pdf-viewer-iframe-container">
        <iframe
          src="/OMNI_Joseph_Quinn_07_19_2024.pdf#view=FitH"
          className="pdf-viewer-iframe"
          title="PDF Viewer"
        ></iframe>
      </div>

      <div className="pdf-viewer-content">
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

export default PDFViewer;
