import * as React from 'react';
import { ChangeEvent } from 'react';
import { AnySSZType, serialize, hashTreeRoot } from "@chainsafe/ssz";
import { names, types } from '../util/types';
import { parseYaml, dumpYaml } from '../util/yaml';
import { createRandomValue } from '../util/random';

export default class Serialize extends React.Component {
    state: {
      input: string;
      type: string;
      inputType: string;
      error: string | undefined;
      serialized: string | undefined;
      hashTreeRoot: string | undefined;
      rows: number;
    };
  constructor(props: any) {
    super(props);
    const initialType = names[Math.floor(Math.random() * names.length)];
    this.state = {
      input: this.createRandom(types[initialType]),
      type: initialType,
      inputType: 'yaml',
      error: undefined,
      serialized: undefined,
      hashTreeRoot: undefined,
      rows: 4,
    };
  }
  createRandom(type: AnySSZType): string {
    return dumpYaml(createRandomValue(type));
  }
  getRows(input: string): number {
    return Math.min(
      16,
      Math.max(
        4,
        Math.floor((input.match(/\n/g) || []).length * 1.5)
      )
    )
  }
  setType(e: ChangeEvent<HTMLSelectElement>) {
    const typeName = e.target.value;
    const input = this.createRandom(types[typeName]);
    this.setState({type: e.target.value, input});
  }
  setInput(e: ChangeEvent<HTMLTextAreaElement>) {
    this.setState({input: e.target.value});
  }
  deleteError() {
    this.setState({error: undefined});
  }
  parsedInput() {
    switch(this.state.inputType) {
      case 'json':
        return JSON.parse(this.state.input);
      case 'yaml':
        return parseYaml(this.state.input, types[this.state.type]);
    }
  }
  serialize() {
    let serialized, root, error;
    try {
      const parsedInput = this.parsedInput();
      const type = types[this.state.type];
      serialized = serialize(parsedInput, type).toString('hex');
      root = hashTreeRoot(parsedInput, type).toString('hex');
    } catch (e) {
      error = e.message;
    }
    this.setState({serialized, hashTreeRoot: root, error});
  }
  render() {
    return (
      <div className='section serialize-section is-family-code'>
        <div className='container'>
          <div className='columns is-desktop'>
            <div className='column'>
              <div className='container'>
                <h3 className='subtitle'>Input</h3>
                <div className='field has-addons'>
                  <div className='control'>
                    <a className='button is-static'>
                      Type
                    </a>
                  </div>
                  <div className='control is-expanded'>
                    <div className='select is-fullwidth'>
                      <select
                        value={this.state.type}
                        onChange={this.setType.bind(this)}>
                      {
                        names.map((name) => <option key={name} value={name}>{name}</option>)
                      }
                      </select>
                    </div>
                  </div>
                </div>
                <textarea className='textarea'
                  rows={this.getRows(this.state.input)}
                  value={this.state.input}
                  onChange={this.setInput.bind(this)} />
                <button className='button is-primary is-medium is-fullwidth is-uppercase is-family-code submit'
                  onClick={this.serialize.bind(this)}>
                  Serialize
                </button>
              </div>
            </div>
            <div className='column'>
              <div className='container'>
                <h3 className='subtitle'>Output</h3>
              {
                this.state.error ? 
                <div className='notification'>

                  <a className='delete'
                    onClick={this.deleteError.bind(this)} />
                  {this.state.error}
                </div>
                :
                <>
                <div className='field has-addons'>
                  <div className='control'>
                    <a className='button is-static'>
                      Serialized
                    </a>
                  </div>
                  <div className='control is-expanded'>
                    <input className='input'
                      type='text'
                      readOnly={true}
                      value={this.state.serialized || ''} />
                  </div>
                </div>
                <div className='field has-addons'>
                  <p className='control'>
                    <a className='button is-static'>
                      HashTreeRoot
                    </a>
                  </p>
                  <p className='control is-expanded'>
                    <input className='input'
                      type='text'
                      readOnly={true}
                      value={this.state.hashTreeRoot || ''} />
                  </p>
                </div>
                </>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
