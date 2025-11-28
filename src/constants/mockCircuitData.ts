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
  {
    id: "circuit-7dc091e9b0e658",
    title: "Half Adder",
    description: "This is circuit of half adder.",
    circuitData: {
      nodes: [
        {
          id: "node-4f5c80eaa5352",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-15b7664e56dc2"],
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
          id: "node-1be466821f5aa8",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-52fcf0b95feeb"],
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
          id: "node-62b065da45c2c8",
          type: "JUNCTION",
          inputs: ["pin-653e68ff2799d8"],
          outputs: ["pin-55c8d0a48dbcb8"],
          coordinate: {
            x: 75,
            y: 0,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-c91b25f3db0b88",
          type: "JUNCTION",
          inputs: ["pin-10cdc7183cf828"],
          outputs: ["pin-d13d8e11d60028"],
          coordinate: {
            x: 125,
            y: 100,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-61811e513359e",
          type: "OR",
          inputs: ["pin-7b831c91fdd7b8", "pin-4f725caae0a6e8"],
          outputs: ["pin-8e913d74c0ce48"],
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
          id: "node-388bd1f2d1a1f8",
          type: "AND",
          inputs: ["pin-2bb41b3b5d5978", "pin-beb02b5b1fd008"],
          outputs: ["pin-a0f5886be3e548"],
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
          id: "node-97ce8913164a5",
          type: "JUNCTION",
          inputs: ["pin-10baec4f03ed18"],
          outputs: ["pin-a4d950475aed48"],
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
          id: "node-beaec8159a5c08",
          type: "NOT",
          inputs: ["pin-bc70854c0e201"],
          outputs: ["pin-68d764d4125198"],
          coordinate: {
            x: 375,
            y: 50,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-2f116bf76dc048",
          type: "AND",
          inputs: ["pin-9d4d3bb5162ef8", "pin-6506cbaeb585c8"],
          outputs: ["pin-78228900d20a48"],
          coordinate: {
            x: 500,
            y: 13.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-341d925273bce",
          type: "EXIT",
          inputs: ["pin-65ec0453a6722"],
          outputs: [],
          coordinate: {
            x: 600,
            y: 13.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-db16a115ce3fe8",
          type: "EXIT",
          inputs: ["pin-6042cbbd70636"],
          outputs: [],
          coordinate: {
            x: 600,
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
          id: "edge-dd494b58b684c",
          from: "pin-15b7664e56dc2",
          to: "pin-653e68ff2799d8",
          waypoints: null,
        },
        {
          id: "edge-3b63bad5ab23",
          from: "pin-52fcf0b95feeb",
          to: "pin-10cdc7183cf828",
          waypoints: null,
        },
        {
          id: "edge-e29958aa0be29",
          from: "pin-55c8d0a48dbcb8",
          to: "pin-7b831c91fdd7b8",
          waypoints: null,
        },
        {
          id: "edge-234e2bf5694a98",
          from: "pin-d13d8e11d60028",
          to: "pin-beb02b5b1fd008",
          waypoints: null,
        },
        {
          id: "edge-241dedcb95fce8",
          from: "pin-55c8d0a48dbcb8",
          to: "pin-2bb41b3b5d5978",
          waypoints: {
            coordinate: {
              x: 75,
              y: 87,
            },
            next: null,
          },
        },
        {
          id: "edge-4b848499ae8208",
          from: "pin-d13d8e11d60028",
          to: "pin-4f725caae0a6e8",
          waypoints: {
            coordinate: {
              x: 125,
              y: 13,
            },
            next: null,
          },
        },
        {
          id: "edge-569752721c19f8",
          from: "pin-8e913d74c0ce48",
          to: "pin-9d4d3bb5162ef8",
          waypoints: null,
        },
        {
          id: "edge-024e623ebb749",
          from: "pin-a0f5886be3e548",
          to: "pin-10baec4f03ed18",
          waypoints: null,
        },
        {
          id: "edge-2bc668fe3ee5b8",
          from: "pin-a4d950475aed48",
          to: "pin-bc70854c0e201",
          waypoints: {
            coordinate: {
              x: 300,
              y: 50,
            },
            next: null,
          },
        },
        {
          id: "edge-25d45818b88c28",
          from: "pin-a4d950475aed48",
          to: "pin-6042cbbd70636",
          waypoints: null,
        },
        {
          id: "edge-c5de3197980ce",
          from: "pin-68d764d4125198",
          to: "pin-6506cbaeb585c8",
          waypoints: {
            coordinate: {
              x: 435,
              y: 50,
            },
            next: {
              coordinate: {
                x: 435,
                y: 20,
              },
              next: null,
            },
          },
        },
        {
          id: "edge-7c7df138efd1",
          from: "pin-78228900d20a48",
          to: "pin-65ec0453a6722",
          waypoints: null,
        },
      ],
    },
    createdAt: "2025-11-12T17:27:29.539Z",
    updatedAt: "2025-11-12T17:27:29.539Z",
  } as Circuit,
  {
    id: "circuit-5270476072c98",
    title: "Full Adder",
    description: "This is circuit of full adder.",
    circuitData: {
      nodes: [
        {
          id: "node-909e90e32876a",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-15b7664e56dc2"],
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
          id: "node-03cca228d41578",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-52fcf0b95feeb"],
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
          id: "node-68eeaa613088f",
          type: "ENTRY",
          inputs: [],
          outputs: ["pin-9a377b650e09b"],
          coordinate: {
            x: 0,
            y: 243.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-b1240644ecfa48",
          type: "JUNCTION",
          inputs: ["pin-653e68ff2799d8"],
          outputs: ["pin-55c8d0a48dbcb8"],
          coordinate: {
            x: 75,
            y: 0,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-012e07678df4a",
          type: "JUNCTION",
          inputs: ["pin-10cdc7183cf828"],
          outputs: ["pin-d13d8e11d60028"],
          coordinate: {
            x: 125,
            y: 100,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-2f1c573e2c1c3",
          type: "OR",
          inputs: ["pin-7b831c91fdd7b8", "pin-4f725caae0a6e8"],
          outputs: ["pin-8e913d74c0ce48"],
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
          id: "node-b50d6b367e58f8",
          type: "AND",
          inputs: ["pin-2bb41b3b5d5978", "pin-beb02b5b1fd008"],
          outputs: ["pin-a0f5886be3e548"],
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
          id: "node-381bf5441508d",
          type: "JUNCTION",
          inputs: ["pin-10baec4f03ed18"],
          outputs: ["pin-a4d950475aed48"],
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
          id: "node-48ae738b7156f8",
          type: "NOT",
          inputs: ["pin-bc70854c0e201"],
          outputs: ["pin-68d764d4125198"],
          coordinate: {
            x: 375,
            y: 50,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-733cfe071281",
          type: "AND",
          inputs: ["pin-9d4d3bb5162ef8", "pin-6506cbaeb585c8"],
          outputs: ["pin-78228900d20a48"],
          coordinate: {
            x: 500,
            y: 13.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-132958a47e0488",
          type: "JUNCTION",
          inputs: ["pin-98b6a7bfccefc"],
          outputs: ["pin-7b978f5a2d3c28"],
          coordinate: {
            x: 275,
            y: 143.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-34c3dc1b4d55e8",
          type: "JUNCTION",
          inputs: ["pin-2ce19b9f8185e8"],
          outputs: ["pin-95ef8d853365e"],
          coordinate: {
            x: 315,
            y: 243.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-f40715a7db05c",
          type: "OR",
          inputs: ["pin-22e82537ccdf18", "pin-f0eca48fd6af68"],
          outputs: ["pin-0fd565bba31a78"],
          coordinate: {
            x: 400,
            y: 150,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-1909dbb39ae4a",
          type: "AND",
          inputs: ["pin-df1522405939d", "pin-4cbe3138fc3d28"],
          outputs: ["pin-2424b16f1fd7a"],
          coordinate: {
            x: 400,
            y: 237,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-ef061604115d2",
          type: "JUNCTION",
          inputs: ["pin-a35c93978c4f08"],
          outputs: ["pin-ac39a456838a7"],
          coordinate: {
            x: 500,
            y: 237,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-c1228a6e5a79c8",
          type: "NOT",
          inputs: ["pin-2a14704ae2802"],
          outputs: ["pin-9320dc2a1a965"],
          coordinate: {
            x: 575,
            y: 200,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-1e649a6080225",
          type: "AND",
          inputs: ["pin-419f97f156ce58", "pin-723c19410677a8"],
          outputs: ["pin-c6e8d7ea968128"],
          coordinate: {
            x: 700,
            y: 156.5,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-530db897d84258",
          type: "OR",
          inputs: ["pin-4cb21821c4fb7", "pin-3656ae53d2025"],
          outputs: ["pin-e977612727d45"],
          coordinate: {
            x: 850,
            y: 100,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-10f78e6069f348",
          type: "EXIT",
          inputs: ["pin-8b42774458fb98"],
          outputs: [],
          coordinate: {
            x: 950,
            y: 0,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
        {
          id: "node-195af7f0505a78",
          type: "EXIT",
          inputs: ["pin-3999905a70afd8"],
          outputs: [],
          coordinate: {
            x: 950,
            y: 100,
          },
          size: {
            x: 60,
            y: 40,
          },
        },
      ],
      edges: [
        {
          id: "edge-1b429911076a08",
          from: "pin-15b7664e56dc2",
          to: "pin-653e68ff2799d8",
          waypoints: null,
        },
        {
          id: "edge-3d02d500e28ad8",
          from: "pin-52fcf0b95feeb",
          to: "pin-10cdc7183cf828",
          waypoints: null,
        },
        {
          id: "edge-0d40fa56014ad",
          from: "pin-55c8d0a48dbcb8",
          to: "pin-7b831c91fdd7b8",
          waypoints: null,
        },
        {
          id: "edge-b9b85513f4c4c8",
          from: "pin-d13d8e11d60028",
          to: "pin-beb02b5b1fd008",
          waypoints: null,
        },
        {
          id: "edge-15febd420c90a8",
          from: "pin-55c8d0a48dbcb8",
          to: "pin-2bb41b3b5d5978",
          waypoints: {
            coordinate: {
              x: 75,
              y: 87,
            },
            next: null,
          },
        },
        {
          id: "edge-a1ca9e1b1840d8",
          from: "pin-d13d8e11d60028",
          to: "pin-4f725caae0a6e8",
          waypoints: {
            coordinate: {
              x: 125,
              y: 13,
            },
            next: null,
          },
        },
        {
          id: "edge-97e65847a44258",
          from: "pin-8e913d74c0ce48",
          to: "pin-9d4d3bb5162ef8",
          waypoints: null,
        },
        {
          id: "edge-40b84ced2923",
          from: "pin-a0f5886be3e548",
          to: "pin-10baec4f03ed18",
          waypoints: null,
        },
        {
          id: "edge-77a3c341fb78a8",
          from: "pin-a4d950475aed48",
          to: "pin-bc70854c0e201",
          waypoints: {
            coordinate: {
              x: 300,
              y: 50,
            },
            next: null,
          },
        },
        {
          id: "edge-8236633b9b424",
          from: "pin-68d764d4125198",
          to: "pin-6506cbaeb585c8",
          waypoints: {
            coordinate: {
              x: 435,
              y: 50,
            },
            next: {
              coordinate: {
                x: 435,
                y: 20,
              },
              next: null,
            },
          },
        },
        {
          id: "edge-fb8d8b011d718",
          from: "pin-9a377b650e09b",
          to: "pin-2ce19b9f8185e8",
          waypoints: null,
        },
        {
          id: "edge-ea98d7802a1be",
          from: "pin-78228900d20a48",
          to: "pin-98b6a7bfccefc",
          waypoints: {
            coordinate: {
              x: 560,
              y: 13.5,
            },
            next: {
              coordinate: {
                x: 560,
                y: 118.5,
              },
              next: {
                coordinate: {
                  x: 275,
                  y: 118.5,
                },
                next: null,
              },
            },
          },
        },
        {
          id: "edge-bc515a7008e438",
          from: "pin-7b978f5a2d3c28",
          to: "pin-22e82537ccdf18",
          waypoints: null,
        },
        {
          id: "edge-267ddce168f4b",
          from: "pin-95ef8d853365e",
          to: "pin-f0eca48fd6af68",
          waypoints: {
            coordinate: {
              x: 315,
              y: 156.5,
            },
            next: null,
          },
        },
        {
          id: "edge-63c69bf3d4a0f8",
          from: "pin-95ef8d853365e",
          to: "pin-4cbe3138fc3d28",
          waypoints: null,
        },
        {
          id: "edge-fd7b2971809948",
          from: "pin-7b978f5a2d3c28",
          to: "pin-df1522405939d",
          waypoints: {
            coordinate: {
              x: 275,
              y: 231.5,
            },
            next: null,
          },
        },
        {
          id: "edge-eb477cebf5021",
          from: "pin-0fd565bba31a78",
          to: "pin-419f97f156ce58",
          waypoints: null,
        },
        {
          id: "edge-819a932f4d9b2",
          from: "pin-2424b16f1fd7a",
          to: "pin-a35c93978c4f08",
          waypoints: null,
        },
        {
          id: "edge-17bc66fac378e",
          from: "pin-ac39a456838a7",
          to: "pin-2a14704ae2802",
          waypoints: {
            coordinate: {
              x: 500,
              y: 200,
            },
            next: null,
          },
        },
        {
          id: "edge-0f5df332f69be",
          from: "pin-9320dc2a1a965",
          to: "pin-723c19410677a8",
          waypoints: {
            coordinate: {
              x: 637.5,
              y: 200,
            },
            next: {
              coordinate: {
                x: 637.5,
                y: 163,
              },
              next: null,
            },
          },
        },
        {
          id: "edge-ec89906750617",
          from: "pin-a4d950475aed48",
          to: "pin-4cb21821c4fb7",
          waypoints: null,
        },
        {
          id: "edge-0dfb3a100b9328",
          from: "pin-ac39a456838a7",
          to: "pin-3656ae53d2025",
          waypoints: {
            coordinate: {
              x: 760,
              y: 237,
            },
            next: {
              coordinate: {
                x: 760,
                y: 106.5,
              },
              next: null,
            },
          },
        },
        {
          id: "edge-32e44952a3fb18",
          from: "pin-e977612727d45",
          to: "pin-3999905a70afd8",
          waypoints: null,
        },
        {
          id: "edge-47ab99fc1bf668",
          from: "pin-c6e8d7ea968128",
          to: "pin-8b42774458fb98",
          waypoints: {
            coordinate: {
              x: 775,
              y: 156.5,
            },
            next: {
              coordinate: {
                x: 775,
                y: 0,
              },
              next: null,
            },
          },
        },
      ],
    },
    createdAt: "2025-11-12T17:54:16.299Z",
    updatedAt: "2025-11-12T17:54:16.299Z",
  } as unknown as Circuit,
];
