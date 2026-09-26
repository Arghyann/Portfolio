---
title: "Why I Built a Toy Blockchain"
description: "A practical walk through elliptic curves, proof of work, and the small distributed blockchain I built to understand Bitcoin."
date: "2026-06-18"
readingTime: "9 min read"
---

# Why?

Over the past few days I have been increasingly interested in cryptography and how it protects all the machines we interact with. While I went down that rabbit hole, I bumped into the idea that makes cryptocurrencies work. So naturally, I tried to recreate it on my own — at least a toy version.

The general premise of a cryptocurrency is that it tries to decentralize payments. Instead of a bank managing and validating transactions for you, we all do it. Every computer starts out as a node that broadcasts transactions to the nodes around it. Since you cannot rely on one person to manage transactions, every node keeps a copy of every transaction that has ever occurred.

However, in a system like this, how do you make sure you actually meant to send those 500 rupees? To combat this, you use the powers of *the discrete logarithm problem*: sometimes it is easy to compute something one way but really hard to reverse it.

## Elliptic Curve Cryptography

You start out with the Bitcoin curve:

$$
y^2 \\equiv x^3 + 7 \\pmod{p}
$$

Here $p$ is a huge prime number that binds us to a finite plane. We define operations on the curve:

$$Add(x,y)$$

Take two points and join them with a line. See where this line cuts the curve, then reflect that point about the x-axis. The result still lies on the curve.

$$Multiply(x,k)$$

Here $x$ is the point and $k$ is a scalar. You add $x$ to itself $k$ times, using repeated doubling so you do not actually perform $k$ additions. For example:

$$53=2^5+2^4+2^2+2^0=110101_2$$

Every person who wants to make transactions has a public and a private key. You take a random point $G$, called the generator, get a private key $d$, and multiply it by the generator. This new point is your public key. It is mathematically infeasible to retrieve the private key if you know $G$ and the public key.

You hash a transaction and sign it using your private key. Anyone with the public key can verify the signature, but only the private key can create it.

## Proof of Work

There is another problem with cryptocurrencies. You could tell Alice you give her 80 rupees and tell Bob you give him 80 rupees at the same time. Both transactions are valid because you signed them, but both cannot happen if you only have 80 rupees. This is the double-spend problem.

Proof of work relies on hash functions. You listen to transactions on the network and add them to your mempool. Then you take some transactions and try to make a block. To mine it, you find a nonce $k$ such that the hash of the transactions with $k$ starts with a certain number of zeroes. The number of zeroes depends on the difficulty $d$.

Each block has the hash of the previous block in its header. Blocks are chained together, hence blockchain. When nodes find conflicting blocks, they defer to the longest chain — the one with the most proof of work.

The system starts falling apart when someone has more than 50% of the network's compute. They could refuse transactions or undo recent transactions by building a longer chain, but they still cannot forge signatures without the private key.

## Birth of BTC

In 2008, *Satoshi Nakamoto* emailed a cryptography mailing list a paper titled *Bitcoin: A Peer-to-Peer Electronic Cash System*. The first block, called the Genesis block, was mined by Satoshi himself. It had no previous block and contained a single block reward transaction.

The first block also had a headline: **“The Times 03/Jan/2009 Chancellor on brink of second bailout for banks”** — a reference to traditional banks struggling at the time.

## My work

I mimicked how Bitcoin works by running nodes as Docker containers. They make random transactions after mining a block and having sufficient money, communicating over TCP sockets. I implemented ECC from scratch to learn more about it and to get more familiar with Java. 10/10. Had fun. Would recommend.

### How to run

```bash
# Start the containers
docker compose up --build

# Watch new blocks
./monitor.sh

# Add a malicious node
./run_attacker.sh
```

The full project is available on [GitHub](https://github.com/Arghyann/Blockchain).
