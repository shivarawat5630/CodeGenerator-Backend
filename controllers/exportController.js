const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const GeneratedCode = require("../models/GeneratedCode");

const downloadComponent = async (req, res) => {
  const { id } = req.params;

  try {
    const generated = await GeneratedCode.findById(id);
    if (!generated) return res.status(404).json({ message: "Component not found" });

    const tempDir = path.join(__dirname, "..", "temp", `${id}`);
    fs.mkdirSync(tempDir, { recursive: true });

    // Write .js and .css files
    const fileName = generated.name || "Component";
    const jsPath = path.join(tempDir, `${fileName}.js`);
    const cssPath = path.join(tempDir, `${fileName}.css`);

    fs.writeFileSync(jsPath, generated.jsxCode || "");
    fs.writeFileSync(cssPath, generated.cssCode || "");

    // Create zip
    const zipPath = path.join(tempDir, "component.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.file(jsPath, { name: `${fileName}.js` });
    archive.file(cssPath, { name: `${fileName}.css` });
    archive.finalize();

    output.on("close", () => {
      // Start download
      res.download(zipPath, "component.zip");

      // Wait for full response to finish
      res.on("finish", () => {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      });
    });

    archive.on("error", (err) => {
      console.error("Archive error:", err);
      res.status(500).json({ message: "Failed to create ZIP" });
    });

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { downloadComponent };
