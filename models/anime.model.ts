import mongoose from "mongoose";

const animeSchema = new mongoose.Schema(
  {
    title: String,
    altTitle: String,
    poster: String,
    rating: String,
    author: String,
    season: {
      label: String,
      slug: String,
    },
    episode: String,
    rilis: String,
    studio: {
      label: String,
      slug: String,
    },
    duration: String,
    type: String,
    status: String,
    genres: [
      {
        label: String,
        slug: String,
      },
    ],
    synopsis: String,
    episodes: [
      {
        episodeNumber: String,
        episodeSlug: String,
        streams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stream" }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure the text index is created after defining the schema
animeSchema.index({ title: 'text', altTitle: 'text', synopsis: 'text', 'genres.label': 'text' });

// Ensure the index is created before using the model
animeSchema.on('index', error => {
  if (error) {
    console.error('Index creation failed:', error);
  }
});

const Anime = mongoose.models.Anime || mongoose.model("Anime", animeSchema);

export default Anime;