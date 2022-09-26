"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer = require('multer');
const fs_1 = __importDefault(require("fs"));
const rest = require('axios').default;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const router = express_1.default.Router();
const uploader = multer({ storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'files'); // 'files' should be replaced with configurable path
        },
        filename: (req, file, cb) => {
            const savedFileName = Date.now() + "_" + file.originalname;
            req.savedFileName = savedFileName;
            cb(null, savedFileName);
        }
    }) });
// /api/extracting
router.post('/file', uploader.single('file'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get file
    const file = req.file;
    console.log(req.savedFileName);
    const dataBuffer = fs_1.default.readFileSync('files/' + req.savedFileName);
    try {
        console.log(file);
        // extract metadata 
        (0, pdf_parse_1.default)(dataBuffer).then(data => {
            console.log(data.metadata);
        }).catch(err => { return next(err); });
        // send metadata and then store metadata to the cache by metadata id
        const result = yield rest.post('http://localhost:8080/api/metadata/file/new', { fileName: file.originalname });
        console.log(result);
        res.status(200).json({ message: 'File sent.', fileName: file.originalname });
    }
    catch (err) {
        return next(err);
    }
}));
router.get('/data', (req, res, next) => {
    // get from redis else mongo
    res.status(501).json({ message: "Not available yet" });
});
exports.default = router;
