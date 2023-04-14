import asyncio
import json

import websockets

# -----------------------------------------------------------------------------
async def handler(websocket):
    async for ws_data in websocket:
        try:
            ws_json = json.loads(ws_data)
            if ws_json["j"] == "a":
                print("Axis " + str(ws_json["i"]) + ": " + str(ws_json["v"]))
                resp = {
                    "j": "a"
                }
                await websocket.send(json.dumps(resp))

            elif ws_json["j"] == "b":
                print("Button " + str(ws_json["i"]) + ": " + str(ws_json["v"]))
                resp = {
                    "j": "b"
                }
                await websocket.send(json.dumps(resp))

            elif ws_json["j"] == "t":
                print("Hat " + str(ws_json["i"]) + ": " + str(ws_json["v"]))
                resp = {
                    "j": "h"
                }
                await websocket.send(json.dumps(resp))
        except json.JSONDecodeError as e:
            print("JSON ERR:" + e)
            continue
        # TODO : bad exception, crash if bad json ?
        except websockets.exceptions.ConnectionClosedError as e:
            print("WSOCK ERR:" + e)
            continue
        except e:
            print("UNKNOWN ERR:" + e)
            continue


# -----------------------------------------------------------------------------
async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


# -----------------------------------------------------------------------------
if __name__ == "__main__":
    asyncio.run(main())