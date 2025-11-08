import type { Circuit } from "@/domain/model/aggregate/circuit";

export const mockCircuitData: Array<Circuit> = [
  {
    id: "circuit-75cbb2e1514b38",
    title: "SR-FF with NOT and AND",
    description: "This is SR-FF consists NOT and AND gates.",
    circuitData: {
      nodes: [
        {
          id: "node-5717b7553ca5c8",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-f5bdde0c670de8"],
          coordinate: {
            x: 0,
            y: 0,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-77fcdbaaadc73",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-b1469c660fb1f8"],
          coordinate: {
            x: 0,
            y: 100,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-d213c061e9fdb8",
          type: "NOT",
          inputs: ["pin-b694d893b1b3a8"],
          outputs: ["pin-ab0ef19f13b6"],
          coordinate: {
            x: 100,
            y: 0,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-f58401d03c4c7",
          type: "NOT",
          inputs: ["pin-a02f6ffd4b619"],
          outputs: ["pin-a1514be9f41e7"],
          coordinate: {
            x: 100,
            y: 100,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-20947307ff857",
          type: "AND",
          inputs: ["pin-213444a72c24a8", "pin-9114b121690cb"],
          outputs: ["pin-3797430f6fdd78"],
          coordinate: {
            x: 200,
            y: 6.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-1370396be7301",
          type: "AND",
          inputs: ["pin-9dc2dd724b6ac", "pin-afc4cc42ecde48"],
          outputs: ["pin-d235cdc0678bb"],
          coordinate: {
            x: 200,
            y: 93.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-e1a823d73063a",
          type: "NOT",
          inputs: ["pin-f23eac4eb30de8"],
          outputs: ["pin-bb367f5141f278"],
          coordinate: {
            x: 300,
            y: 6.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-2ae56ac7db3ae",
          type: "NOT",
          inputs: ["pin-10058903ada8e8"],
          outputs: ["pin-7194ea96e82848"],
          coordinate: {
            x: 300,
            y: 93.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-3b21993bbc53a",
          type: "JUNCTION",
          inputs: ["pin-f6f2733a9941"],
          outputs: ["pin-9651beb70464c"],
          coordinate: {
            x: 400,
            y: 6.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-399ca6b27eb69",
          type: "JUNCTION",
          inputs: ["pin-119f497ca40d2"],
          outputs: ["pin-df33fdee600c48"],
          coordinate: {
            x: 400,
            y: 93.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-54e9ccfcab1cd8",
          type: "EXIT",
          inputs: ["pin-9139224a6ef84"],
          outputs: [],
          coordinate: {
            x: 500,
            y: 6.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-a30a04cdb51168",
          type: "EXIT",
          inputs: ["pin-3ecc2619fe3358"],
          outputs: [],
          coordinate: {
            x: 500,
            y: 93.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
      ],
      edges: [
        {
          id: "edge-ace1c4e0f2a38",
          from: "pin-f5bdde0c670de8",
          to: "pin-b694d893b1b3a8",
          waypoints: null,
        },
        {
          id: "edge-132e2205782f3",
          from: "pin-b1469c660fb1f8",
          to: "pin-a02f6ffd4b619",
          waypoints: null,
        },
        {
          id: "edge-e2d23aba3b0778",
          from: "pin-a1514be9f41e7",
          to: "pin-afc4cc42ecde48",
          waypoints: null,
        },
        {
          id: "edge-4d436d797e1a",
          from: "pin-ab0ef19f13b6",
          to: "pin-213444a72c24a8",
          waypoints: null,
        },
        {
          id: "edge-38fae52ed7ca68",
          from: "pin-3797430f6fdd78",
          to: "pin-f23eac4eb30de8",
          waypoints: null,
        },
        {
          id: "edge-d74b6745e5ab8",
          from: "pin-d235cdc0678bb",
          to: "pin-10058903ada8e8",
          waypoints: null,
        },
        {
          id: "edge-e0d9081ed1fb3",
          from: "pin-7194ea96e82848",
          to: "pin-119f497ca40d2",
          waypoints: null,
        },
        {
          id: "edge-885b977f93c7a8",
          from: "pin-bb367f5141f278",
          to: "pin-f6f2733a9941",
          waypoints: null,
        },
        {
          id: "edge-f8e00720c5584",
          from: "pin-9651beb70464c",
          to: "pin-9139224a6ef84",
          waypoints: null,
        },
        {
          id: "edge-700d68016d8078",
          from: "pin-df33fdee600c48",
          to: "pin-3ecc2619fe3358",
          waypoints: null,
        },
        {
          id: "edge-eba360bd0fd508",
          from: "pin-df33fdee600c48",
          to: "pin-9114b121690cb",
          waypoints: {
            coordinate: {
              x: 400,
              y: 66.5,
            },
            next: {
              coordinate: {
                x: 140,
                y: 33.5,
              },
              next: {
                coordinate: {
                  x: 140,
                  y: 13.5,
                },
                next: null,
              },
            },
          },
        },
        {
          id: "edge-02c78c589a86",
          from: "pin-9651beb70464c",
          to: "pin-9dc2dd724b6ac",
          waypoints: {
            coordinate: {
              x: 400,
              y: 33.5,
            },
            next: {
              coordinate: {
                x: 140,
                y: 66.5,
              },
              next: {
                coordinate: {
                  x: 140,
                  y: 86.5,
                },
                next: null,
              },
            },
          },
        },
      ],
    },
    createdAt: "2025-11-08T12:19:32.754Z",
    updatedAt: "2025-11-08T12:19:32.754Z",
  } as Circuit,
];
