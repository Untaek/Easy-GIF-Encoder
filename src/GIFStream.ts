import { SimpleBlock } from "./SimpleBlock";

/**
 *                      [ GIF Grammar ]
 * 
 *          <GIF Data Stream> ::= Header <Logical Screen> <Data>* Trailer
 *
 *           <Logical Screen> ::= Logical Screen Descriptor [Global Color Table]
 *
 *                     <Data> ::= <Graphic Block> | <Special-Purpose Block>
 *
 *            <Graphic Block> ::= [Graphic Control Extension] <Graphic-Rendering Block>
 *
 *  <Graphic-Rendering Block> ::= <Table-Based Image> | Plain Text Extension
 *
 *        <Table-Based Image> ::= Image Descriptor [Local Color Table] Image Data
 *
 *    <Special-Purpose Block> ::= Application Extension | Comment Extension
 */

class GIFStream {
    private header: Int8Array = SimpleBlock.Header()
    private trailer: Int8Array = SimpleBlock.Trailer()
}