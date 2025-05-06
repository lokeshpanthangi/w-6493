
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Room, 
  Participant, 
  Option, 
  Vote,
  Decision,
  getRoomById,
  getRoomParticipants,
  getRoomOptions,
  getRoomVotes,
  getDecision
} from '@/services/api';

export const useRoomRealtime = (roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room data
        const roomData = await getRoomById(roomId);
        if (!roomData) throw new Error('Room not found');
        setRoom(roomData);
        
        // Fetch participants
        const participantsData = await getRoomParticipants(roomId);
        setParticipants(participantsData);
        
        // Fetch options
        const optionsData = await getRoomOptions(roomId);
        setOptions(optionsData);
        
        // Fetch votes if allowed
        if (!roomData.hide_results_until_end || roomData.phase === 'results') {
          const votesData = await getRoomVotes(roomId);
          setVotes(votesData);
        }
        
        // Fetch decision if exists
        const decisionData = await getDecision(roomId);
        if (decisionData) setDecision(decisionData);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch room data'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [roomId]);

  // Set up realtime subscriptions
  useEffect(() => {
    // Subscribe to changes
    const channel = supabase
      .channel(`room-${roomId}`)
      // Room changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        async (payload) => {
          console.log('Room change:', payload);
          if (payload.eventType === 'DELETE') {
            setRoom(null);
          } else {
            const roomData = await getRoomById(roomId);
            setRoom(roomData);
          }
        }
      )
      // Participant changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${roomId}` },
        async () => {
          console.log('Participants change');
          const participantsData = await getRoomParticipants(roomId);
          setParticipants(participantsData);
        }
      )
      // Option changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'options', filter: `room_id=eq.${roomId}` },
        async () => {
          console.log('Options change');
          const optionsData = await getRoomOptions(roomId);
          setOptions(optionsData);
        }
      )
      // Vote changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `room_id=eq.${roomId}` },
        async () => {
          console.log('Votes change');
          if (room && (!room.hide_results_until_end || room.phase === 'results')) {
            const votesData = await getRoomVotes(roomId);
            setVotes(votesData);
          }
        }
      )
      // Decision changes
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'decisions', filter: `room_id=eq.${roomId}` },
        async () => {
          console.log('Decision change');
          const decisionData = await getDecision(roomId);
          setDecision(decisionData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, room]);

  return {
    room,
    participants,
    options,
    votes,
    decision,
    loading,
    error,
  };
};
