import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Sends a team member invitation for a specific route.
 * 
 * @param teamMemberEmail - The email address of the team member to invite.
 * @param routeNumber - The route number for which the invitation is being sent.
 * @param ownerEmail - The email address of the owner sending the invitation.
 */
export async function sendTeamMemberInvite(teamMemberEmail: string, routeNumber: string, ownerEmail: string) {
  try {
    const db = getFirestore();
    const inviteDocRef = doc(db, 'invitations', `${routeNumber}-${teamMemberEmail}`);

    // Save the invitation to Firestore
    await setDoc(inviteDocRef, {
      teamMemberEmail,
      routeNumber,
      ownerEmail,
      status: 'pending', // Default status for invitations
      createdAt: serverTimestamp(),
    });

    console.log(`Invitation sent to ${teamMemberEmail} for Route ${routeNumber}`);
  } catch (error) {
    console.error('Failed to send invitation:', error);
    throw new Error('Failed to send invitation. Please try again later.');
  }
}
