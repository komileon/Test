import type { BNode } from "../types/blog.types"
import FieldPreview from "./FieldPreview"

const EditPreview = ({
    fields
}: { fields: BNode[] }) => {
    return (
        <div className="w-full min-h-screen bg-zinc-100 flex flex-col gap-6">

            {/* <div className="w-full min-h-10 bg-zinc-300">ytfgyjugvju</div> */}



            <section className="relative w-4/5 md:w-3/5 xl:w-1/2 2xl:w-2/5 px-4 mx-auto mb-10">

                {
                    fields.map((field, index) => (
                        <FieldPreview
                            key={field.id}
                            index={index}
                            field={field}
                        />
                    ))
                }
            </section>



        </div>
    )
}

export default EditPreview
