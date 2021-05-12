import Layer from "../types/Layer";
import DXFWriter from "@tarikjabiri/dxf";

// TODO: Write own dxf writer, current library doesn't support POLYGONS
// TODO: and groups
export default class DXFSerializer {
    public static serialize(layers: Layer[]): string {
        const drw = new DXFWriter();
        drw.setUnit(DXFWriter.units.Millimeters);
        for (const layer of layers) {
            drw.addLayer(layer.name, layer.layerColor, "CONTINUOS");
            drw.setCurrentLayer(layer.name);

            for (const d of layer.shapes) {
                try {
                    d.toDXF(drw);

                    if (d.type === "Group") drw.setCurrentLayer(layer.name);
                } catch (err) {
                    console.error(err);
                    continue;
                }
            }
        }

        return drw.stringify();
    }
}