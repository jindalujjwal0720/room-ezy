interface Room {
  _id: string;
  capacity: number;
  wantedBy: string[];
}

const unique = (arr: string[]) => [...new Set(arr)];

const generateFlowGraph = (rooms: Room[]) => {
  let students: string[] = [];
  rooms.forEach((room) => {
    students.push(...room.wantedBy);
  });
  students = unique(students);

  const n = rooms.length;
  const m = students.length;
  const source = 0;
  const sink = m + n + 1;
  const studentOffset = 1;
  const roomOffset = m + 1;
  const N = m + n + 2;

  const adjList = Array(N)
    .fill(null)
    .map(() => [] as number[]);
  const capacityMatrix = Array(N)
    .fill(null)
    .map(() => Array(N).fill(0));

  const roomIndexMap: { [key: string]: number } = {};
  const studentIndexMap: { [key: string]: number } = {};

  // Add edges from source to students
  students.forEach((student, i) => {
    const studentIndex = i + studentOffset;

    adjList[source].push(studentIndex);
    adjList[studentIndex].push(source);

    capacityMatrix[source][studentIndex] = 1;

    studentIndexMap[student] = i;
  });

  // Add edges from students to rooms
  // Add edges from rooms to sink
  rooms.forEach((room, i) => {
    const roomIndex = i + roomOffset;

    adjList[roomIndex].push(sink);
    adjList[sink].push(roomIndex);

    capacityMatrix[roomIndex][sink] = room.capacity;

    room.wantedBy.forEach((student) => {
      const studentIndex = students.indexOf(student) + studentOffset;

      adjList[studentIndex].push(roomIndex);
      adjList[roomIndex].push(studentIndex);

      capacityMatrix[studentIndex][roomIndex] = 1;
    });

    roomIndexMap[room._id] = i;
  });

  return {
    adjList,
    capacityMatrix,
    roomIndexMap,
    students,
    studentIndexMap,
    studentsLength: m,
    roomsLength: n,
    source,
    sink,
  };
};

export const allocateRoomsByMaxFlow = (rooms: Room[]) => {
  const {
    adjList,
    capacityMatrix,
    roomIndexMap,
    students,
    studentIndexMap,
    studentsLength,
    roomsLength,
    source,
    sink,
  } = generateFlowGraph(rooms);

  const N = studentsLength + roomsLength + 2;

  const bfs = (parent: number[]) => {
    parent.fill(-1);
    parent[source] = -2;
    const queue = [{ node: source, flow: Infinity }] as {
      node: number;
      flow: number;
    }[];

    while (queue.length > 0) {
      const nextNode = queue.shift();
      if (nextNode) {
        const { node, flow } = nextNode;

        for (const next of adjList[node]) {
          if (parent[next] === -1 && capacityMatrix[node][next] > 0) {
            parent[next] = node;
            const newFlow = Math.min(flow, capacityMatrix[node][next]);
            if (next === sink) {
              return newFlow;
            }
            queue.push({ node: next, flow: newFlow });
          }
        }
      }
    }

    return 0;
  };

  const maxFlow = () => {
    const parent = Array(N).fill(-1);
    parent[source] = -2;

    let newFlow = 0;
    while ((newFlow = bfs(parent)) > 0) {
      let cur = sink;
      while (cur !== source) {
        const prev = parent[cur];
        capacityMatrix[prev][cur] -= newFlow;
        capacityMatrix[cur][prev] += newFlow;
        cur = prev;
      }
    }
  };

  maxFlow();

  const allocation: { [key: string]: string[] } = {};
  const allocatedStudents = Array(studentsLength).fill(false);
  const filledRooms = Array(roomsLength).fill(false);

  rooms.forEach((room) => {
    allocation[room._id] = [];
    const roomIndex = roomIndexMap[room._id];

    students.forEach((student) => {
      const studentIndex = studentIndexMap[student];
      if (
        capacityMatrix[roomIndex + studentsLength + 1][studentIndex + 1] === 1
      ) {
        allocation[room._id].push(student);
        allocatedStudents[studentIndex] = true;
      }
    });

    if (allocation[room._id].length === room.capacity) {
      filledRooms[roomIndex] = true;
    }
  });

  const unfilledRooms = rooms
    .filter((room) => {
      const roomIndex = roomIndexMap[room._id];
      return !filledRooms[roomIndex];
    })
    .map((room) => room._id);
  const unallocatedStudents = students.filter((student) => {
    const studentIndex = studentIndexMap[student];
    return !allocatedStudents[studentIndex];
  });

  return {
    allocation,

    unfilledRooms,
    unallocatedStudents,
  };
};

export const allocateRooms = (rooms: Room[]) => {
  const {
    allocation,

    unfilledRooms,
    unallocatedStudents,
  } = allocateRoomsByMaxFlow(rooms);

  for (const roomId of unfilledRooms) {
    const room = rooms.find((room) => room._id === roomId);
    if (room) {
      const remainingCapacity = room.capacity - allocation[room._id].length;
      if (unallocatedStudents.length >= remainingCapacity) {
        allocation[room._id].push(
          ...unallocatedStudents.splice(0, remainingCapacity)
        );
      } else {
        allocation[room._id].push(...unallocatedStudents);
        unallocatedStudents.length = 0;
      }
    }
  }

  return { allocation };
};
