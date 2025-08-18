import {FormDropdown, FormField, FormTextBox} from "../../Form/form-partials.jsx";
import PropTypes from "prop-types";
import {schemes} from "../../../utils/enums.utils.js";

RdSAP.propTypes = { 
    field: PropTypes.object,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired
}

export default function RdSAP ({title,field = {}, show}) {
   
  return (
    <div  className={show ? 'block' : 'hidden'}>
        {/* Lead Form Content */}
        <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 mt-8'>
            <h2 className="col-span-full text-xl font-bold">{title} Information</h2>
            <FormField label='Pre EPR' name='preEpr' type='text' placeholder='Pre EPR'
                       defaultValue={field?.preEpr}/>
            <FormField label='Post EPR' name='postErp' type='text' placeholder='Post EPR'
                       defaultValue={field?.postErp}/>
            <FormField label='Measures	' name='measures' type='text' placeholder='Measures	'
                       defaultValue={field?.measures}/>
            <FormField label='ABS' name='abs' type='text' placeholder='ABS'
                       defaultValue={field?.abs}/>

            <FormDropdown label='Scheme' name='scheme' type='text' placeholder='Scheme'
                          defaultValue={field?.scheme} options={schemes}/>
            <FormField label='Total Area' name='totalArea' type='text' placeholder='Total Area'
                       defaultValue={field?.totalArea}/>
            <FormField label='EWI & Others' name='ewi' type='text' placeholder='EWI & Others'
                       defaultValue={field?.ewi}/>
            <FormField label='Important Bits' name='importantBits' type='text' placeholder='Important Bits'
                       defaultValue={field?.importantBits}/>

            <div className={'col-span-full'}>
                <FormTextBox label={'Notes'} name={'notes_2'} placeholder={'Enter Notes'} defaultValue={field?.notes[2]}/>
            </div>

        </div>
    </div>
  )
}