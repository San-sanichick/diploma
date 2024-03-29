import Layer from "../types/Layer";
import DXFWriter from "@tarikjabiri/dxf";

// In the specification there is nothing about grouping entities.
// The only way to group entities is by layers with (deferent or same) colors and linetypes.
// I am trying to enhance my library but I found the specification hard to understand.
// So good luck bro.


// TODO: Write own dxf writer, current library doesn't support POLYGONS
// TODO: and groups
/**
 * It is important to understand, that DXF documentation is utter dogshit,
 * try finding any information on how to assign entities to a group, I dare you.
 * 
 * And who THE FUCK decided that "GROUP CODES" is a good name for something,
 * that has NOTHING to do with GROUP OBJECTS,
 * fucking autodesk, I swear to god.
 * 
 * It is ACTUALLY FUCKING IMPOSSIBLE to find ANYTHING related to GROUPS, because
 * fucking google keeps spewing out info about stupid fucking group codes
 * 
 * UPD: As it turns out, LibreCAD, for example, doesn't even support groups
 * 
 * NB: If ya wanna group something, use bloody blocks. I will not redo all this shit,
 * so we're stuck with groups
 */
export default class DXFSerializer {
    public static serialize(layers: Layer[]): string {
        const drw = new DXFWriter();
        drw.setUnit(DXFWriter.units.Millimeters);
        for (const layer of layers) {
            drw.addLayer(layer.name, layer.layerColor, "CONTINUOUS");
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