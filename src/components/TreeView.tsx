/* eslint-disable */

import * as React from "react";
// @ts-ignore
import EyzyTree from "eyzy-tree";
import {Node as SSZNode, getChildNodes, getRootNode, isBottomType} from "../util/partials";
import {
  BitVectorType,
  ByteVectorType,
  Type,
  UintType,
  isBooleanType,
  isUintType,
  isBitListType,
  isBitVectorType,
  isByteVectorType,
  isVectorType,
  isListType,
  isContainerType,
  VectorType,
  ListType,
} from "@chainsafe/ssz";
import BN from "bn.js";
import {presets, PresetName} from "../util/types";

// const getTypeName = (typ: FullSSZType, types: Record<string, AnySSZType>): string => typeNames[typ.type](typ, types);

// type TypeNameRecords = Record<Type, (t: FullSSZType, types: Record<string, AnySSZType>) => string>

function getTypeName<T>(type: Type<T>, types: Record<string, Type<T>>, name: string): string | undefined {
  if(isBooleanType(type)) return "bool";
  else if(isUintType(type)) return `uint${(type.byteLength * 8)}`;
  else if(isBitListType(type)) return "BitList";
  else if(isBitVectorType(type)) return `BitVector[${type.length}]`;
  else if(isBitListType(type)) return "Bytes";
  else if(isByteVectorType(type)) return `BytesN[${type.length}]`;
  else if(isVectorType(type)) return "Vector"; //[${getTypeName(type.elementType, types, 'rescursive placeholder')}, ${(type as VectorType).length}]`;
  else if(isListType(type)) return "List"; //[${getTypeName(type.elementType, types, 'rescursive placeholder')}]`;
  else if(isContainerType(type)) return `${name}(Container)`;
  else return "N/A";
}

function getKind<T>(type: Type<T>): string {
  if(isBooleanType(type)) return "bool";
  else if(isUintType(type)) return "uint";
  else if(isBitListType(type)) return "BitList";
  else if(isBitVectorType(type)) return "BitVector";
  else if(isBitListType(type)) return "Bytes";
  else if(isByteVectorType(type)) return "BytesN";
  else if(isVectorType(type)) return "Vector";
  else if(isListType(type)) return "List";
  else if(isContainerType(type)) return "Container";
  else return "N/A";
}

type Node<T> = {
  sszNode: SSZNode<T>;
  isBatch: boolean;
  isListKey: boolean;
  text: string;
  typeWidth: number;
  keyWidth: number;
  expanded: boolean;
};

type NodeProps<T> = {
  node: Node<T>;
};

type Props<T> = {
  presetName: PresetName;
  input: any;
  sszTypeName: string;
  sszType: Type<T>; // @TODO: is this correct?
  name: string | undefined;
};

type State<T> = {
  rootNode: SSZNode<T> | undefined;
  selectedNode: Node<T> | undefined;
};

type DefProps = {
  title: string;
  children: any;
  isHeader: boolean | undefined;
};

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

const DisplayNodeInfo = (props: NodeProps<any>) => {
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
  );
};

export default class TreeView<T> extends React.Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);
    this.state = {
      rootNode: undefined,
      selectedNode: undefined,
    };
  }

  static getDerivedStateFromProps<T>(nextProps: Props<T>, _prevState: State<T>) {
    const rootNode = getRootNode(nextProps.input, nextProps.sszType);
    return {rootNode};
  }

  static renderArrow<T>(_nodeProps: NodeProps<T>) {
    return <span className="node-arrow"/>;
  }

  static renderText<T>(nodeProps: NodeProps<T>) {
    const sszNode = nodeProps.node.sszNode;
    return (
      <span className={"ssz-" + getKind(sszNode.type)}>
        <span className={"node-key " + (nodeProps.node.isListKey ? "list-key" : "normal-key")} key="text-key" style={{width: `${nodeProps.node.keyWidth + 1}ch`}}>
          {sszNode.key}
        </span>
        <span className="node-type" key="text-type" style={{width: `${nodeProps.node.typeWidth + 1}ch`}}>
          {nodeProps.node.text}
        </span>
        {
          isListType(nodeProps.node.sszNode.type)
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

  onSelect(node: Node<T>) {
    this.setState({selectedNode: node});
  }

  render() {
    const {presetName, sszTypeName} = this.props;
    const types = presets[presetName];
    const {rootNode, selectedNode} = this.state;
    return (
      <div className='container'>
        <div className='columns is-desktop'>
          <div className='column'>
            <div className='container'>
              <h3 className='subtitle'>Tree-view</h3>
              {rootNode && rootNode.type ?
                <EyzyTree
                  data={({
                    sszNode: rootNode,
                    isBatch: !isBottomType(rootNode.type),
                    isListKey: false,
                    text: getTypeName(rootNode.type, types, sszTypeName),
                    expanded: false,
                  })}
                  theme={["ssz-tree"]}
                  expandOnSelect={true}
                  arrowRenderer={TreeView.renderArrow}
                  textRenderer={TreeView.renderText}
                  onSelect={this.onSelect.bind(this)}
                  fetchData={async(node) => {
                    const childNodes = getChildNodes(this.state.rootNode ? this.state.rootNode : node);
                    const out = childNodes.map((n): Node<T> => ({
                      sszNode: n,
                      isBatch: !isBottomType(n.type),
                      isListKey: isListType(node.sszNode.type) || isVectorType(node.sszNode.type),
                      text: getTypeName(n.type, types, "placeholder!"),
                      typeWidth: 0,
                      keyWidth: 0,
                      expanded: false,
                    }));
                    let maxTypeWidth = 0; // hack to simulate a table layout in a list.
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
                    return out.map((n): Node<T> => ({
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
