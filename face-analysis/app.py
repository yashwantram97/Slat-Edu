from flask import Flask, jsonify, request, make_response
from deepface import DeepFace
import argparse
import uuid
import json
import time
from tqdm import tqdm
from services import faceAnalysis
from flask_cors import CORS


import tensorflow as tf
tf_version = int(tf.__version__.split(".")[0])

app = Flask(__name__)
CORS(app)


@app.route('/verify', methods=['POST'])
def verify():
	tic = time.time()
	req = request.get_json()
	trx_id = uuid.uuid4()

	resp_obj = verifyWrapper(req, trx_id)

	#--------------------------

	toc =  time.time()

	resp_obj["trx_id"] = trx_id
	resp_obj["seconds"] = toc-tic

	return resp_obj, 200


@app.route('/face/verification', methods=['POST'])
def faceVerification():
    tic = time.time()
    req = request.get_json()
    
    no_of_faces = faceAnalysis.getNumberOfFacesInImage(req["img"])
    result = {}
    if no_of_faces == 0:
        result["face_count"] = no_of_faces
        result["status"] = False
        result["message"] = "No face found. Please send image with clear face."

        return jsonify(result), 200

    elif no_of_faces == 1:
        result["face_count"] = no_of_faces
        result["status"] = True
        result["message"] = "Face found. Thank you"

        return jsonify(result), 200

    elif no_of_faces > 1:
        result["face_count"] = no_of_faces
        result["status"] = False
        result["message"] = "Multiple faces found. Please stay alone while taking up exam"

        return jsonify(result), 200

    elif no_of_faces == -1:
        result["face_count"] = no_of_faces
        result["status"] = False
        result["message"] = "Some error occured. Please try again after some time"

        return jsonify(result), 200

@app.route('/pose/verification', methods=['POST'])
def poseVerification():
    req = request.get_json()

    pose = faceAnalysis.headPoseEstimate(req["img"])
    result = {}
    if pose.lower() == "forward":
        result["pose"] = pose
        result["status"] = True
        result["message"] = "please maintain this pose through out the exam"

    elif pose != None:
        result["pose"] = pose
        result["status"] = False
        result["message"] = "Please look straight and resubmut the image"
    
    else:
        result["pose"] = ""
        result["status"] = False
        result["message"] = "Something went wrong. Please try again"
    
    return jsonify(result), 200

@app.route('/analyse/face', methods=['POST'])
def AnalyseFace():

    tic = time.time()

    req = request.get_json()
    raw_content = req["img"]
    trx_id = uuid.uuid4()

    for item in raw_content:
        img1 = item["img1"]
        img2 = item["img2"]
    
    no_of_faces = faceAnalysis.getNumberOfFacesInImage(img2)

    pose = faceAnalysis.headPoseEstimate(img2)

    resp_obj = verifyWrapper(req, trx_id)

    result = {}
    result["face_count"] = no_of_faces
    result["pose"] = pose
    result["face_verification"] = resp_obj

    toc =  time.time()

    print("TIME TAKE =>",toc - tic)

    return jsonify(result),200


@app.route('/register/face', methods=['POST'])
def registerFace():
    req = request.get_json()
    img = req["img"]
    
    no_of_faces = faceAnalysis.getNumberOfFacesInImage(img)

    pose = faceAnalysis.headPoseEstimate(img)

    result = {}
    result["face_count"] = no_of_faces
    result["pose"] = pose

    return jsonify(result),200


def verifyWrapper(req, trx_id = 0):

	resp_obj = jsonify({'success': False})

	model_name = "VGG-Face"; distance_metric = "cosine"; detector_backend = "opencv"
	if "model_name" in list(req.keys()):
		model_name = req["model_name"]
	if "distance_metric" in list(req.keys()):
		distance_metric = req["distance_metric"]
	if "detector_backend" in list(req.keys()):
		detector_backend = req["detector_backend"]

	#----------------------

	instances = []
	if "img" in list(req.keys()):
		raw_content = req["img"] #list

		for item in raw_content: #item is in type of dict
			instance = []
			img1 = item["img1"]; img2 = item["img2"]

			validate_img1 = False
			if len(img1) > 11 and img1[0:11] == "data:image/":
				validate_img1 = True

			validate_img2 = False
			if len(img2) > 11 and img2[0:11] == "data:image/":
				validate_img2 = True

			if validate_img1 != True or validate_img2 != True:
				return jsonify({'success': False, 'error': 'you must pass both img1 and img2 as base64 encoded string'}), 205

			instance.append(img1); instance.append(img2)
			instances.append(instance)

	#--------------------------

	if len(instances) == 0:
		return jsonify({'success': False, 'error': 'you must pass at least one img object in your request'}), 205

	print("Input request of ", trx_id, " has ",len(instances)," pairs to verify")

	#--------------------------

	try:
		resp_obj = DeepFace.verify(instances
			, model_name = model_name
			, distance_metric = distance_metric
			, detector_backend = detector_backend
            , enforce_detection = False
		)

	except Exception as err:
		resp_obj = jsonify({'success': False, 'error': str(err)}), 205

	return resp_obj

def preload():
    metrics = ["cosine", "euclidean", "euclidean_l2"]
    result = DeepFace.verify(img1_path = "./preload/one.jpg", img2_path = "./preload/one.jpg", distance_metric = metrics[1])
    print("=============================PRELOAD COMPLETED============================")
	
    parser = argparse.ArgumentParser()
    parser.add_argument(
		'-p', '--port',
		type=int,
		default=5000,
		help='Port of serving api')
    args = parser.parse_args()
    app.run(host='0.0.0.0', port=args.port, debug=True)

if __name__ == '__main__':
    preload()