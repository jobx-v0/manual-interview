class PeerService {
  peer: RTCPeerConnection;

  constructor() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    if (this.peer) {
      try {
        console.log("Received offer:", offer);

        // Validate the offer
        if (!offer?.sdp || !offer?.type) {
          throw new Error("Invalid offer SDP or type");
        }

        // Set the remote description
        console.log("Setting remote description with offer...");
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));

        // Create and set the local answer
        console.log("Creating answer...");
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));

        console.log("Local description set with answer.");
        return ans;
      } catch (error) {
        console.error("Error in getAnswer:", error);
        throw error;
      }
    } else {
      throw new Error("Peer connection is not initialized.");
    }
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit): Promise<void> {
    if (this.peer) {
      console.log(`Current signaling state: ${this.peer?.signalingState}`);

      // Check if the state is correct for setting the remote description
      if (this.peer?.signalingState === "have-local-offer") {
        await this.peer?.setRemoteDescription(new RTCSessionDescription(ans));
      } else {
        console.warn(
          `Invalid signaling state: ${this.peer?.signalingState}. Cannot set remote description.`
        );
      }
    }
  }

  async getOffer(): Promise<RTCSessionDescriptionInit | null> {
    if (this.peer) {
      try {
        // Ensure the signaling state is stable
        if (this.peer?.signalingState === "stable") {
          const offer = await this.peer?.createOffer();
          await this.peer?.setLocalDescription(
            new RTCSessionDescription(offer)
          );
          return offer;
        } else {
          console.warn(
            `Cannot create offer in signaling state: ${this.peer?.signalingState}`
          );
          return null;
        }
      } catch (error) {
        console.error("Error creating or setting offer:", error);
        throw error;
      }
    }
    return null;
  }

  resetPeer() {
    this.peer?.close();
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }
}

export default new PeerService();
