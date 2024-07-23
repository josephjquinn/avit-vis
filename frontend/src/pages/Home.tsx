import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const Home: React.FC = () => {
  return (
    <div>
      <h1 style={{ color: "white" }}>This is home component</h1>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <Viewer
          fileUrl="../../public/OMNI_Joseph_Quinn_07_19_2024.pdf"
          defaultScale={0.4}
          theme={"dark"}
        ></Viewer>
      </Worker>
      <div>
        <p>
          Batch size: This influences the amount of data processed in parallel
          during each training iteration.
          <br />
          Patch size: This determines the spatial resolution at which the input
          image is divided into smaller segments (patches). Larger patch sizes
          capture more global context but may lose fine-grained details, while
          smaller patch sizes enhance local detail but may require more patches
          and thus more computational resources.
          <br />
          Model size: Processor blocks: The number of transformer layers (or
          blocks) determines the depth and complexity of the model's
          hierarchical feature extraction and contextual understanding.
          Embedding dimension: This refers to the dimensionality of the input
          embeddings, specifically the size of each patch inputted into the
          model. A higher embedding dimension allows for a better representation
          of the data, potentially capturing more detailed and nuanced features.
          However, it also increases computational demands. Num Heads: This
          Determines how many parallel attention mechanisms operate within each
          transformer block. More heads can enhance the model's ability to focus
          on diverse aspects of the input, facilitating better feature
          extraction and representation learning.
        </p>
      </div>
    </div>
  );
};

export default Home;
