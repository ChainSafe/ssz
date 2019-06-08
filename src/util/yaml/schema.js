// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


var {Schema} = require('js-yaml');


module.exports = new Schema({
  include: [
    require('js-yaml/lib/js-yaml/schema/failsafe')
  ],
  implicit: [
    require('js-yaml/lib/js-yaml/type/null'),
    require('js-yaml/lib/js-yaml/type/bool'),
    require('./int'),
    require('js-yaml/lib/js-yaml/type/float')
  ],
  explicit: [
  ]
});
