import { allocateRooms, allocateRoomsByMaxFlow } from '../allocation';

describe('allocation', () => {
  describe('allocateRoomsByMaxFlow', () => {
    it('should return allocation, unfilledRooms, and unallocatedStudents', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 3, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 4, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 5, wantedBy: ['d', 'e', 'f'] },
      ];
      const result = allocateRoomsByMaxFlow(rooms);

      expect(result).toHaveProperty('allocation');
      expect(result).toHaveProperty('unfilledRooms');
      expect(result).toHaveProperty('unallocatedStudents');
    });

    it("should allocate rooms to students if the rooms' capacity is more", () => {
      const rooms = [
        { _id: '1', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 2, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 2, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 2, wantedBy: ['d', 'e', 'f'] },
      ];
      const expected = {
        '1': ['a', 'b'],
        '2': ['c'],
        '3': ['d'],
        '4': ['e', 'f'],
        '5': [],
      };
      const { allocation } = allocateRoomsByMaxFlow(rooms);

      expect(allocation).toEqual(expected);
    });

    it("should allocate rooms to students if the rooms' capacity is less", () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 1, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 1, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 1, wantedBy: ['d', 'e', 'f'] },
      ];
      const expected = {
        '1': ['a'],
        '2': ['b'],
        '3': ['c'],
        '4': ['d'],
        '5': ['e'],
      };
      const { allocation } = allocateRoomsByMaxFlow(rooms);

      expect(allocation).toEqual(expected);
    });

    it('should allocate rooms to students if the rooms have different capacities', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 3, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 4, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 5, wantedBy: ['d', 'e', 'f'] },
      ];
      const expected = {
        '1': ['a'],
        '2': ['b', 'c'],
        '3': ['d'],
        '4': ['e', 'f'],
        '5': [],
      };
      const { allocation } = allocateRoomsByMaxFlow(rooms);

      expect(allocation).toEqual(expected);
    });

    it('should return unfilled rooms correctly if there are rooms that are not filled', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 3, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 4, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 5, wantedBy: ['d', 'e', 'f'] },
      ];
      const { allocation, unfilledRooms } = allocateRoomsByMaxFlow(rooms);
      const filledRooms = Object.keys(allocation).filter(
        (roomId) =>
          allocation[roomId].length ===
          rooms.find((room) => room._id === roomId)?.capacity
      );
      const expectedUnfilledRooms = rooms
        .filter((room) => !filledRooms.includes(room._id))
        .map((room) => room._id);

      expect(unfilledRooms).toEqual(expectedUnfilledRooms);
    });

    it('should return unallocated students correctly if there are students that are not allocated', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 1, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 1, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 1, wantedBy: ['d', 'e', 'f'] },
      ];
      const { allocation, unallocatedStudents } = allocateRoomsByMaxFlow(rooms);
      const allocatedStudents = [...new Set(Object.values(allocation).flat())];
      const allStudents = [...new Set(rooms.flatMap((room) => room.wantedBy))];
      const expectedUnallocatedStudents = allStudents.filter(
        (student) => !allocatedStudents.includes(student)
      );

      expect(unallocatedStudents).toEqual(expectedUnallocatedStudents);
    });
  });
  describe('allocateRooms', () => {
    it('should return allocation', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 3, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 4, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 5, wantedBy: ['d', 'e', 'f'] },
      ];
      const result = allocateRooms(rooms);

      expect(result).toHaveProperty('allocation');
    });

    it('should allocate rooms to all students if rooms are enough', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 2, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 3, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 4, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 5, wantedBy: ['d', 'e', 'f'] },
      ];

      const result = allocateRooms(rooms);
      const { allocation } = result;
      const allStudents = [...new Set(rooms.flatMap((room) => room.wantedBy))];
      const allocatedStudents = [...new Set(Object.values(allocation).flat())];
      const unallocatedStudents = allStudents.filter(
        (student) => !allocatedStudents.includes(student)
      );

      expect(unallocatedStudents).toHaveLength(0);
    });

    it('should allocate rooms to max students if the rooms are not enough', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '2', capacity: 1, wantedBy: ['a', 'b', 'c'] },
        { _id: '3', capacity: 1, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 1, wantedBy: ['d', 'e', 'f'] },
        { _id: '5', capacity: 1, wantedBy: ['d', 'e', 'f'] },
      ];

      const result = allocateRooms(rooms);
      const { allocation } = result;
      const maxCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);
      const allStudents = [...new Set(rooms.flatMap((room) => room.wantedBy))];
      const allocatedStudents = [...new Set(Object.values(allocation).flat())];
      const unallocatedStudents = allStudents.filter(
        (student) => !allocatedStudents.includes(student)
      );

      expect(unallocatedStudents).not.toHaveLength(0);
      expect(allocatedStudents).toHaveLength(maxCapacity);
    });

    it('should allocate rooms to remaining students randomly', () => {
      const rooms = [
        { _id: '1', capacity: 1, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '2', capacity: 1, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '3', capacity: 1, wantedBy: ['a', 'b', 'c', 'd'] },
        { _id: '4', capacity: 1, wantedBy: [] },
      ];

      const result = allocateRooms(rooms);
      const { allocation } = result;
      const allStudents = [...new Set(rooms.flatMap((room) => room.wantedBy))];
      const allocatedStudents = [...new Set(Object.values(allocation).flat())];
      const unallocatedStudents = allStudents.filter(
        (student) => !allocatedStudents.includes(student)
      );

      expect(unallocatedStudents).toHaveLength(0);
      expect(allocatedStudents).toHaveLength(allStudents.length);
    });

    const NRooms = 1000;
    const NStudents = 2000;
    const NPreferences = 10;
    const RoomCapacity = 2;

    // Generate random data for large test
    const rooms = Array.from({ length: NRooms }, (_, i) => ({
      _id: i.toString(),
      capacity: RoomCapacity,
      wantedBy: Array.from({ length: NPreferences }, () =>
        Math.floor(Math.random() * NStudents).toString()
      ),
    }));
    const SR_Ratio = Math.ceil(NStudents / NRooms);
    rooms.forEach((room, index) => {
      room.wantedBy = [
        ...new Set(room.wantedBy),
        Array.from({ length: SR_Ratio }, (_, i) =>
          (index * SR_Ratio + i).toString()
        ),
      ].flat();
    });

    it('should work for large data', () => {
      const result = allocateRooms(rooms);
      const { allocation } = result;
      const allStudents = [...new Set(rooms.flatMap((room) => room.wantedBy))];
      const allocatedStudents = [...new Set(Object.values(allocation).flat())];
      const unallocatedStudents = allStudents.filter(
        (student) => !allocatedStudents.includes(student)
      );

      expect(unallocatedStudents).toHaveLength(0);
      expect(allocatedStudents).toHaveLength(allStudents.length);
    });
  });
});
