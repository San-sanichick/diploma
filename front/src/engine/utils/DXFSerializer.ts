import Layer from "../types/Layer";
import DXFWriter from "@tarikjabiri/dxf";

// TODO: Write own dxf writer, current library doesn't support POLYGONS
// TODO: and groups
// ! It is important to understand, that DXF documentation is utter dogshit,
// ! try finding any information on how to assign entities to a group, I dare you
// ! And who THE FUCK decided that "GROUP CODES" is a good name for something,
// ! that has NOTHING to do with GROUP OBJECTS
// ! fucking autodesk, I swear to god
// ! UPD: As it turns out, LibreCAD, for example, doesn't even support groups
// ! NB: If ya wanna group something, use bloody blocks. I will not redo all this shit just,
// ! so we're stuck with groups
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
                    // the library doesn't support groups, so I create a new layer instead
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