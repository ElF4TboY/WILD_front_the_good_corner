import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { __Tag } from "@/types";
import { useCreateAdMutation } from "../graphql/generated/schema";
import { useCategoriesQuery, useTagsQuery } from "@/graphql/generated/schema";

export default function NewAd() {
  const router = useRouter();

  const { data } = useCategoriesQuery();
  const categories = data?.categories || [];

  const { data: tagsData } = useTagsQuery();
  const tags = tagsData?.getTagByName || [];
  const tagOptions = tags as any;
  const [selectedTags, setSelectedTags] = useState<__Tag[]>([]);

  const [createAd] = useCreateAdMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formJSON: any = Object.fromEntries(formData.entries());
    formJSON.category = parseInt(formJSON.category, 10);
    formJSON.price = parseFloat(formJSON.price);
    formJSON.tags = selectedTags.map((t) => ({ id: t.id }));

    createAd({
      variables: {
        data: formJSON,
      },
    })
      .then((res) => router.push(`/ads/${res.data?.createAd.id}`))
      .catch(console.error);
  };

  return (
    <Layout pageTitle="Creation d'une annonce">
      <h1 className="pt-6 pb-6 text-2xl">Creer une annonce</h1>

      <form onSubmit={handleSubmit} className="pb-12">
        <div className="flex flex-wrap gap-6 mb-3">
          <div className="form-control w-full">
            <label className="label" htmlFor="title">
              <span className="label-text">Titre</span>
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              placeholder="Zelda : Ocarina of time"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-3">
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="location">
              <span className="label-text">Localisation</span>
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              placeholder="Paris"
              className="input input-bordered w-full max-w-xs"
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="owner">
              <span className="label-text">Auteur</span>
            </label>
            <input
              type="text"
              name="owner"
              id="owner"
              required
              placeholder="Link"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-3">
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="price">
              <span className="label-text">Prix</span>
            </label>
            <input
              required
              type="number"
              name="price"
              id="price"
              min={0}
              placeholder="30"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="picture">
              <span className="label-text">Image</span>
            </label>
            <input
              type="text"
              name="picture"
              id="picture"
              required
              placeholder="https://imageshack.com/zoot.png"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mb-3 mt-6">
          <div className="form-control w-full max-w-xs">
            <label className="label" htmlFor="category">
              <span className="label-text">Catégorie</span>
            </label>
            <select
              className="select select-bordered"
              id="category"
              name="category"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full max-w-xs">
            <label htmlFor="tags" className="label">
              <span className="label-text">Tags</span>
            </label>
            <Select
              options={tagOptions}
              getOptionValue={(o: any) => o.value || (o.id.toString() as any)}
              getOptionLabel={(o: any) => o.label || o.name}
              isMulti
              name="tags"
              id="tags"
              value={selectedTags}
              closeMenuOnSelect={false}
              onChange={(tags) => {
                setSelectedTags(tags as any);
              }}
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="description">
            <span className="label-text">Description</span>
          </label>
          <textarea
            rows={5}
            className="textarea textarea-bordered"
            placeholder="The Legend of Zelda: Ocarina of Time est un jeu vidéo d'action-aventure développé par Nintendo EAD et édité par Nintendo sur Nintendo 64. Ocarina of Time raconte l'histoire de Link, un jeune garçon vivant dans un village perdu dans la forêt, qui parcourt le royaume d'Hyrule pour empêcher Ganondorf d'obtenir la Triforce, une relique sacrée partagée en trois : le courage (Link), la sagesse (Zelda) et la force (Ganondorf)."
            name="description"
            id="description"
            required
          ></textarea>
        </div>

        <button className="btn btn-primary text-white mt-12 w-full">
          Envoyer
        </button>
      </form>
    </Layout>
  );
}
