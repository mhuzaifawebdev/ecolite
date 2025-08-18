import { FormField, FormTextBox } from "../../Form/form-partials.jsx";
import { uploadImage } from "../../../Config/api.js";
import { baseUrlImg } from "../../../Config/Urls.js";
import { FaEye, FaTrash} from "react-icons/fa";
// ✅ FIXED: Remove the problematic import and use public URL directly
// import imageUploader from  '../../../../public/image/csv_uploads.png'; // ❌ This was causing the error
import {IoDocument} from "react-icons/io5";

const preQualificationDocuments = ({ title, Docs, setDocs, show, field }) => {

    const handleDocChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        let updatedDocs = [...Docs];

        for (let i = 0; i < files.length; i++) {
            const upload = await uploadImage(files[i]);
            if (upload.url) {
                updatedDocs.push(upload.url);
            }
        }
        setDocs(updatedDocs);
    };

    const handleDocDelete = (index) => {
        if(confirm('Are you sure you want to delete this file?')) {
            const updatedDocs = Docs.filter((_, i) => i !== index);
            setDocs(updatedDocs);
        }
    };

    const downloadFile = (url, filename = "file") => {
        const link = document.createElement("a");
        link.href = `${baseUrlImg}/${url}`;
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const renderPreview = (docUrl) => {
        const isImage = docUrl.match(/\.(jpeg|jpg|png|gif|svg)$/i);
        const isPdf = docUrl.match(/\.pdf$/i);
        const isDocx = docUrl.match(/\.docx$/i);
        const isCsv = docUrl.match(/\.csv$/i);

        if (isImage) {
            return <>
                <img src={`${baseUrlImg}/${docUrl}`} alt="Uploaded Image"
                     className="h-[200px] w-[150px] object-cover" />
                <button
                    type={'button'}
                    onClick={() => downloadFile(docUrl, "image")}
                    className="absolute top-2 right-10 bg-blue-500 text-white p-2 rounded"
                    aria-label="Download image"
                >
                    <FaEye />
                </button>
            </>
        } else if (isPdf) {
            return  <embed src={`${baseUrlImg}/${docUrl}`} width="150px" height="200px" type="application/pdf" />
        } else {
            return <div className="p-2 text-center">
                    <IoDocument className={'m-auto w-[120px] h-[120px]'} />
                    <button
                        type={'button'}
                        onClick={() => downloadFile(docUrl, isDocx ? "document.docx" : isCsv ? "file.csv" : "file")}
                        className=" mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {isDocx ? "Download Word Doc" : isCsv ? "Download CSV" : "Download Document" }
                    </button>
                </div>
        }
    };

    const handleAddNewFile = () => {
        document.getElementById('doc-upload').click();
    }

    return (
        <div className={show ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8">
                <h2 className="col-span-full text-xl font-bold">{title} Information</h2>

                <div className="col-span-full">
                    <FormField
                        id={'doc-upload'}
                        className={'hidden'}
                        label="Documents"
                        multiple={true}
                        type="file"
                        placeholder="Upload Documents (Images, PDFs, Word, or CSV)"
                        accept="image/*,application/*"
                        onChange={(e) => handleDocChange(e)}
                        name={''}
                    />
                </div>

                {/* ✅ FIXED: Use public URL directly instead of import */}
                <img
                    src="/image/csv_uploads.png"
                    onClick={handleAddNewFile}
                    alt="Upload Image"
                    className="w-[100px] h-[100px] mt-5 ml-5 cursor-pointer"
                />

                {Docs && Docs.length > 0  ? <div className="col-span-full">
                    <h3 className="font-bold">Uploaded Documents</h3>
                    <div className="flex flex-wrap gap-4">
                        {Docs.map((element, index) => (
                            <div key={index} className="p-2 rounded relative">
                                {renderPreview(element)}
                                <button
                                    type="button"
                                    onClick={() => handleDocDelete(index)}
                                    className="absolute top-2 right-1 bg-red-500 text-white p-2 rounded"
                                >
                                    <FaTrash/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div> : null}

                <div className="col-span-full">
                    <FormTextBox
                        label="Notes"
                        name="notes_1"
                        placeholder="Enter Notes"
                        defaultValue={field?.notes[1]}
                    />
                </div>
            </div>
        </div>
    );
};

export default preQualificationDocuments;