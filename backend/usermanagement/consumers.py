# # consumers.py
# import re
# import queue
# import time
# import json
# from google.cloud import speech
from channels.generic.websocket import AsyncWebsocketConsumer
# import os
# import asyncio
#
# # Audio recording parameters
# STREAMING_LIMIT = 20000  # 20 seconds (originally 4 mins but shortened for testing purposes)
# CHUNK_SIZE = 1600  # Adjust chunk size as needed
# SAMPLE_RATE = 16000
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/dineshbhupathi/Downloads/poetic-centaur-413709-084aabc8320b.json'
#
class TranscriptionConsumer(AsyncWebsocketConsumer):
    pass

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.client = speech.SpeechClient()
#         config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=SAMPLE_RATE,
#         language_code="en-US",
#         max_alternatives=1,
#         model="medical_dictation",
#     )
#         self.streaming_config =speech.StreamingRecognitionConfig(
#         config=config, interim_results=True
#     )
#         self.audio_input = queue.Queue()
#
#     async def connect(self):
#         await self.accept()
#         asyncio.create_task(self.listen_and_transcribe())
#
#     async def disconnect(self, close_code):
#         pass
#
#     async def receive(self, text_data):
#         # Receive audio data from the frontend
#         data = json.loads(text_data)
#         # print(data)
#         audio_chunk = data['audioData']
#         # print(audio_chunk)
#         self.audio_input.put(audio_chunk)
#
#     async def send_transcription(self, transcript):
#         await self.send(text_data=json.dumps({'transcript': transcript}))
#
#     async def listen_and_transcribe(self):
#         while True:
#             if self.audio_input.empty():
#                 await asyncio.sleep(0.1)
#                 # print('lksdfjlksdk')
#                 continue
#             # print('lsdjsdlfjl')
#             audio_generator = self.generator()
#             print(audio_generator)
#             requests = (
#                 speech.StreamingRecognizeRequest(audio_content=content)
#                 for content in audio_generator
#             )
#             print(requests)
#             responses = self.client.streaming_recognize(self.streaming_config, requests)
#             print(responses)
#             # Now, put the transcription responses to use.
#             # listen_print_loop(responses, stream)
#
#
#     async def listen_print_loop(self, responses):
#         for response in responses:
#             for result in response.results:
#                 transcript = result.alternatives[0].transcript
#                 await self.send_transcription(transcript)
#
#     def get_audio_generator(self):
#         # print(self.audio_input,'ksdjfksd')
#         while not self.audio_input.empty():
#             audio_chunk = self.audio_input.get()
#             # print(audio_chunk,'skdjhjks')
#             yield speech.StreamingRecognizeRequest(audio_content=audio_chunk)
#
#     def generator(self):
#         """Stream Audio from microphone to API and to local buffer"""
#         chunk_size = 1600  # Define the chunk size
#         while not self.closed:
#             data = []
#
#             if self.new_stream and self.last_audio_input:
#                 chunk_time = STREAMING_LIMIT / len(self.last_audio_input)
#                 if chunk_time != 0:
#                     if self.bridging_offset < 0:
#                         self.bridging_offset = 0
#                     if self.bridging_offset > self.final_request_end_time:
#                         self.bridging_offset = self.final_request_end_time
#
#                     chunks_from_ms = round(
#                         (self.final_request_end_time - self.bridging_offset)
#                         / chunk_time
#                     )
#
#                     self.bridging_offset = round(
#                         (len(self.last_audio_input) - chunks_from_ms) * chunk_time
#                     )
#
#                     for i in range(chunks_from_ms, len(self.last_audio_input)):
#                         data.append(self.last_audio_input[i])
#
#                 self.new_stream = False
#
#             chunk = self._buff.get()
#             self.audio_input.append(chunk)
#
#             if chunk is None:
#                 return
#             data.append(chunk)
#
#             while True:
#                 try:
#                     chunk = self._buff.get(block=False)
#
#                     if chunk is None:
#                         return
#                     data.append(chunk)
#                     self.audio_input.append(chunk)
#
#                 except queue.Empty:
#                     break
#
#             # Split the data into chunks of 1600 samples each
#             for i in range(0, len(data), chunk_size):
#                 chunk_data = b"".join(data[i:i + chunk_size])
#                 yield chunk_data
#
# # import os
# # import re
# # import sys
# # import time
# # import pyaudio
# # import queue
# # from google.cloud import speech
# # from channels.generic.websocket import AsyncWebsocketConsumer,WebsocketConsumer
# #
# # # Audio recording parameters
# # STREAMING_LIMIT = 20000  # 20 seconds (originally 4 mins but shortened for testing purposes)
# # SAMPLE_RATE = 16000
# # CHUNK_SIZE = int(SAMPLE_RATE / 10)  # 100ms
# #
# # # Environment Variable set for Google Credentials. Put the json service account
# # # key in the root directory
# # os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/Users/dineshbhupathi/Downloads/poetic-centaur-413709-084aabc8320b.json'
# #
# # class TranscriptionConsumer(AsyncWebsocketConsumer):
# #     async def connect(self):
# #         print('skjhsdkj')
# #         self.accept()
# #
# #     async def disconnect(self, close_code):
# #         pass
# #         # self.mic_manager.close()
# #
# #     async def receive(self, text_data):
# #         print(text_data,'lll')
# #         pass
# #
# #     async def send(self, text_data=None, bytes_data=None, close=False):
# #         print(text_data,'kkk')
# #         pass
# #
# #
# #     def send_transcription(self, transcript):
# #         print(transcript)
# #         self.send(text_data=transcript)
# #
# #     def listen_and_transcribe(self):
# #         with self.mic_manager as stream:
# #             while not stream.closed:
# #                 audio_generator = stream.generator()
# #
# #                 requests = (
# #                     speech.StreamingRecognizeRequest(audio_content=content)
# #                     for content in audio_generator
# #                 )
# #
# #                 responses = self.client.streaming_recognize(self.streaming_config, requests)
# #
# #                 # Now, put the transcription responses to use.
# #                 self.listen_print_loop(responses, stream)
# #
# #                 if stream.result_end_time > 0:
# #                     stream.final_request_end_time = stream.is_final_end_time
# #                 stream.result_end_time = 0
# #                 stream.last_audio_input = []
# #                 stream.last_audio_input = stream.audio_input
# #                 stream.audio_input = []
# #                 stream.restart_counter = stream.restart_counter + 1
# #
# #                 if not stream.last_transcript_was_final:
# #                     self.send_transcription("\n")
# #                 stream.new_stream = True
# #
# #     def listen_print_loop(self, responses, stream):
# #         """Iterates through server responses and sends transcription to client."""
# #
# #         for response in responses:
# #             if get_current_time() - stream.start_time > STREAMING_LIMIT:
# #                 stream.start_time = get_current_time()
# #                 break
# #
# #             if not response.results:
# #                 continue
# #
# #             result = response.results[0]
# #
# #             if not result.alternatives:
# #                 continue
# #
# #             transcript = result.alternatives[0].transcript
# #
# #             if result.is_final:
# #                 transcript_data = "FINAL RESULT @ " + str(stream.result_end_time / 1000) + ": " + transcript + "\n"
# #                 self.send_transcription(transcript_data)
# #                 stream.is_final_end_time = stream.result_end_time
# #                 stream.last_transcript_was_final = True
# #
# #                 # Exit recognition if any of the transcribed phrases could be
# #                 # one of our keywords.
# #                 if re.search(r"\b(exit|quit)\b", transcript, re.I):
# #                     self.close()
# #                     break
# #             else:
# #                 transcript_data = "INTERIM RESULT @ " + str(stream.result_end_time / 1000) + ": " + transcript + "\r"
# #                 self.send_transcription(transcript_data)
# #                 stream.last_transcript_was_final = False
# #
# # class ResumableMicrophoneStream:
# #     """Opens a recording stream as a generator yielding the audio chunks."""
# #
# #     def __init__(self, rate, chunk_size):
# #         self._rate = rate
# #         self.chunk_size = chunk_size
# #         self._num_channels = 1
# #         self._buff = queue.Queue()
# #         self.closed = True
# #         self.start_time = get_current_time()
# #         self.restart_counter = 0
# #         self.audio_input = []
# #         self.last_audio_input = []
# #         self.result_end_time = 0
# #         self.is_final_end_time = 0
# #         self.final_request_end_time = 0
# #         self.bridging_offset = 0
# #         self.last_transcript_was_final = False
# #         self.new_stream = True
# #         self._audio_interface = pyaudio.PyAudio()
# #         self._audio_stream = self._audio_interface.open(
# #             format=pyaudio.paInt16,
# #             channels=self._num_channels,
# #             rate=self._rate,
# #             input=True,
# #             frames_per_buffer=self.chunk_size,
# #             # Run the audio stream asynchronously to fill the buffer object.
# #             # This is necessary so that the input device's buffer doesn't
# #             # overflow while the calling thread makes network requests, etc.
# #             stream_callback=self._fill_buffer,
# #         )
# #
# #     def __enter__(self):
# #         self.closed = False
# #         return self
# #
# #     def __exit__(self, type, value, traceback):
# #         self._audio_stream.stop_stream()
# #         self._audio_stream.close()
# #         self.closed = True
# #         # Signal the generator to terminate so that the client's
# #         # streaming_recognize method will not block the process termination.
# #         self._buff.put(None)
# #         self._audio_interface.terminate()
# #
# #     def _fill_buffer(self, in_data, *args, **kwargs):
# #         """Continuously collect data from the audio stream, into the buffer."""
# #         self._buff.put(in_data)
# #         return None, pyaudio.paContinue
# #
# #     def generator(self):
# #         """Stream Audio from microphone to API and to local buffer"""
# #
# #         while not self.closed:
# #             data = []
# #
# #             if self.new_stream and self.last_audio_input:
# #                 chunk_time = STREAMING_LIMIT / len(self.last_audio_input)
# #
# #                 if chunk_time != 0:
# #                     if self.bridging_offset < 0:
# #                         self.bridging_offset = 0
# #
# #                     if self.bridging_offset > self.final_request_end_time:
# #                         self.bridging_offset = self.final_request_end_time
# #
# #                     chunks_from_ms = round(
# #                         (self.final_request_end_time - self.bridging_offset)
# #                         / chunk_time
# #                     )
# #
# #                     self.bridging_offset = round(
# #                         (len(self.last_audio_input) - chunks_from_ms) * chunk_time
# #                     )
# #
# #                     for i in range(chunks_from_ms, len(self.last_audio_input)):
# #                         data.append(self.last_audio_input[i])
# #
# #                 self.new_stream = False
# #
# #             chunk = self._buff.get()
# #             self.audio_input.append(chunk)
# #
# #             if chunk is None:
# #                 return
# #             data.append(chunk)
# #
# #             while True:
# #                 try:
# #                     chunk = self._buff.get(block=False)
# #
# #                     if chunk is None:
# #                         return
# #                     data.append(chunk)
# #                     self.audio_input.append(chunk)
# #
# #                 except queue.Empty:
# #                     break
# #
# #             yield b"".join(data)
# #
# # def get_current_time():
# #     """Return Current Time in MS."""
# #     return int(round(time.time() * 1000))
