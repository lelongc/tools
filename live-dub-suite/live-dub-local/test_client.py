import asyncio
import websockets
import json

async def test():
    try:
        async with websockets.connect("ws://localhost:8765") as ws:
            print("Connected to ws://localhost:8765")
            # Create a 3s dummy audio array (16000 * 3) of float32
            import numpy as np
            dummy_audio = np.zeros(16000 * 3, dtype=np.float32)
            await ws.send(dummy_audio.tobytes())
            print("Sent audio chunk")
            
            # Wait for response
            response = await asyncio.wait_for(ws.recv(), timeout=10.0)
            print("Received:", response)
    except Exception as e:
        print("Error:", e)

asyncio.run(test())
