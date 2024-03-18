import test from 'ava'

import { getNode, getNodesAtDepth, setNode, setNodesAtDepth, subtreeFillToContents, subtreeFillToDepth, subtreeFillToLength, zeroNode, } from '../index.js'

test('basics', (t) => {
  const z0 = zeroNode(0)
  const z1 = zeroNode(1)
  const z2 = zeroNode(2)
  const z3 = zeroNode(3)
  t.deepEqual(z1.left.root, z0.root)
  t.deepEqual(z2.left.left.root, z0.root)

  const t0 = subtreeFillToDepth(z0, 2)
  t.deepEqual(t0.root, z2.root)

  const t1 = subtreeFillToLength(z1, 2, 3)
  t.deepEqual(t1.left.root, z2.root)

  const t2 = subtreeFillToContents([z1, z1], 2)
  t.deepEqual(t2.left.root, z2.root)
  t.deepEqual(t2.right.root, z1.root)

  const t3 = subtreeFillToContents([z0, z1, z2, z3], 2)
  t.deepEqual(getNode(t3, "100").root, z0.root)
  t.deepEqual(getNode(t3, "101").root, z1.root)
  t.deepEqual(getNode(t3, "110").root, z2.root)
  t.deepEqual(getNode(t3, "111").root, z3.root)

  const t4 = setNode(t3, "111", z0)
  t.deepEqual(getNode(t4, "100").root, z0.root)
  t.deepEqual(getNode(t4, "101").root, z1.root)
  t.deepEqual(getNode(t4, "110").root, z2.root)
  t.deepEqual(getNode(t4, "111").root, z0.root)

  const n0 = [getNode(t3, "101"), getNode(t3, "110")]
  t.deepEqual(n0[0].root, z1.root)
  t.deepEqual(n0[1].root, z2.root)

  console.log("t3")
  for (let i = 0; i < 8; i++) {
    const gindex = i.toString(2);
    console.log(gindex, Buffer.from(getNode(t3, gindex).root).toString('hex'))
  }
  const n1 = getNodesAtDepth(t3, 2, 0, 2)
  t.deepEqual(n1[0].root, z0.root)
  t.deepEqual(n1[1].root, z1.root)

  const n2 = getNodesAtDepth(t3, 2, 1, 2)
  t.deepEqual(n2[0].root, z1.root)
  t.deepEqual(n2[1].root, z2.root)

  const n3 = getNodesAtDepth(t3, 2, 1, 3)
  t.deepEqual(n3[0].root, z1.root)
  t.deepEqual(n3[1].root, z2.root)
  t.deepEqual(n3[2].root, z3.root)

  const t5 = setNodesAtDepth(t3, 2, [0, 1], [z2, z3])
  console.log("t5")
  for (let i = 0; i < 8; i++) {
    const gindex = i.toString(2);
    console.log(gindex, Buffer.from(getNode(t5, gindex).root).toString('hex'))
  }
  t.deepEqual(getNode(t5, "100").root, z2.root)
  t.deepEqual(getNode(t5, "101").root, z3.root)
})
