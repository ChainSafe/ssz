import * as React from "react";
// @ts-ignore
import EyzyTree from "eyzy-tree";
import {Node as SSZNode, getChildNodes, getRootNode, isBottomType} from "../util/partials";
import {
    BitVectorType,
    ByteVectorType,
    ContainerType,
    FullSSZType,
    ListType,
    Type,
    UintType,
    VectorType,
    AnySSZType,
} from "@chainsafe/ssz";
import BN from "bn.js";
import {presets, typeName, PresetName} from "../util/types";

const getTypeName = (typ: FullSSZType, types: Record<string, AnySSZType>): string => typeNames[typ.type](typ, types);

type TypeNameRecords = Record<Type, (t: FullSSZType, types: Record<string, AnySSZType>) => string>

const typeNames: TypeNameRecords = {
    [Type.bool]: (t) => "bool",
    [Type.uint]: (t) => "uint" + ((t as UintType).byteLength * 8),
    [Type.bitList]: (t) => "BitList",
    [Type.bitVector]: (t) => `BitVector[${(t as BitVectorType).length}]`,
    [Type.byteList]: (t) => "Bytes",
    [Type.byteVector]: (t) => `BytesN[${(t as ByteVectorType).length}]`,
    [Type.vector]: (t, types) => `Vector[${getTypeName((t as VectorType).elementType, types)}, ${(t as VectorType).length}]`,
    [Type.list]: (t, types) => `List[${getTypeName((t as ListType).elementType, types)}]`,
    [Type.container]: (t, types) => `${typeName(t, types)}(Container)`,
};

const getKind = (typ: FullSSZType): string => typeKindNames[typ.type];

const typeKindNames = {
    [Type.bool]: "bool",
    [Type.uint]: "uint",
    [Type.bitList]: "BitList",
    [Type.bitVector]: "BitVector",
    [Type.byteList]: "Bytes",
    [Type.byteVector]: "BytesN",
    [Type.vector]: "Vector",
    [Type.list]: "List",
    [Type.container]: "Container",
};

type Node = {
    sszNode: SSZNode;
    isBatch: boolean;
    isListKey: boolean;
    text: string;
    typeWidth: number;
    keyWidth: number;
    expanded: boolean;
}

type NodeProps = {
    node: Node
}

type Props = {
    presetName: PresetName;
    input: any;
    sszType: FullSSZType;
}

type State = {
    rootNode: SSZNode | undefined;
    selectedNode: Node | undefined;
}


type DefProps = {
    title: string;
    children: any;
    isHeader: boolean | undefined
}

const Definition = (props: DefProps) => (
    <div className="definition field">

        <div className="field-label is-small">
            <label className={"label "
            + (props.isHeader ? "def-header" : "")}>{props.title}</label>
        </div>
        <div className="field-body">
            {props.children}
        </div>
    </div>
);
Definition.defaultProps = {
    title: "",
    children: undefined,
    isHeader: false
};

const DisplayNodeInfo = (props: NodeProps) => {

    const genIndexBN = new BN(props.node.sszNode.genIndex, 2);
    return (
        <div>
            <i style={{fontSize: "0.7em"}}>Note: generalized indices are unfinalized,
                SSZ is being updated for static generalized indices in dynamic-length lists</i>
            <Definition title="Generalized index" isHeader>
                <Definition title="Binary"><code>{props.node.sszNode.genIndex}</code></Definition>
                <Definition title="Hex"><code>{"0x" + genIndexBN.toString(16)}</code></Definition>
                <Definition title="Decimal"><code>{genIndexBN.toString(10)}</code></Definition>
            </Definition>
            <Definition title="Node" isHeader>
                <Definition title="Type"><code>{props.node.text}</code></Definition>
                <Definition title="Key"><code>{props.node.sszNode.key}</code></Definition>
            </Definition>
        </div>
    )
};

export default class TreeView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            rootNode: undefined,
            selectedNode: undefined,
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        return {rootNode: getRootNode(nextProps.input, nextProps.sszType)}
    }

    static renderArrow(nodeProps: NodeProps) {
        return <span className="node-arrow"/>
    }

    static renderText(nodeProps: NodeProps) {
        const sszNode = nodeProps.node.sszNode;
        return (
            <span className={"ssz-" + getKind(sszNode.type)}>
                <span className={"node-key " + (nodeProps.node.isListKey ? "list-key" : "normal-key")}
                      key="text-key" style={{width: `${nodeProps.node.keyWidth + 1}ch`}}>
                    {sszNode.key}
                </span>
                <span className="node-type" key="text-type" style={{width: `${nodeProps.node.typeWidth + 1}ch`}}>
                    {nodeProps.node.text}
                </span>
                {
                    nodeProps.node.sszNode.type.type == Type.list
                    && <i className="node-type" key="text-type-addon" >({nodeProps.node.sszNode.data.length} items)</i>
                }
                {isBottomType(sszNode.type) &&
                <span className="node-value" key="text-value">
                        {sszNode.data}
                    </span>
                }
            </span>
        );
    }

    onSelect(node: Node) {
        this.setState({selectedNode: node});
    }

    render() {
        const {presetName} = this.props;
        const types = presets[presetName as keyof typeof presets];
        const {rootNode, selectedNode} = this.state;
        return (
            <div className='container'>
                <div className='columns is-desktop'>
                    <div className='column'>
                        <div className='container'>
                            <h3 className='subtitle'>Tree-view</h3>
                            {rootNode ?
                                <EyzyTree
                                    data={({
                                        sszNode: rootNode,
                                        isBatch: !isBottomType(rootNode.type),
                                        isListKey: false,
                                        text: getTypeName(rootNode.type, types),
                                        expanded: false,
                                    })}
                                    theme={["ssz-tree"]}
                                    expandOnSelect={true}
                                    arrowRenderer={TreeView.renderArrow}
                                    textRenderer={TreeView.renderText}
                                    onSelect={this.onSelect.bind(this)}
                                    fetchData={async (node: Node) => {
                                        const childNodes = getChildNodes(node.sszNode);
                                        const out = childNodes.map((n): Node => ({
                                            sszNode: n,
                                            isBatch: !isBottomType(n.type),
                                            isListKey: node.sszNode.type.type == Type.list || node.sszNode.type.type == Type.vector,
                                            text: getTypeName(n.type, types),
                                            typeWidth: 0,
                                            keyWidth: 0,
                                            expanded: false,
                                        }));
                                        let maxTypeWidth = 0;  // hack to simulate a table layout in a list.
                                        let maxKeyWidth = 0;
                                        out.forEach((n) => {
                                            if (n.text.length > maxTypeWidth) {
                                                maxTypeWidth = n.text.length;
                                            }
                                            const kl = n.sszNode.key.toString().length;
                                            if (kl > maxKeyWidth) {
                                                maxKeyWidth = kl;
                                            }
                                        });
                                        return out.map((n): Node => ({
                                            ...n,
                                            typeWidth: maxTypeWidth,
                                            keyWidth: maxKeyWidth,
                                        }));
                                    }}
                                />
                                : <span>No data</span>}
                        </div>
                    </div>

                    <div className='column'>
                        <div className='container'>
                            <h3 className='subtitle'>Node details</h3>
                            {selectedNode && <DisplayNodeInfo node={selectedNode}/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
