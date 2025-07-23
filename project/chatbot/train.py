from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import get_peft_model, LoraConfig, TaskType
from datasets import load_dataset

# Load dataset
dataset = load_dataset("json", data_files="calendar-archive.jsonl")

# Load tokenizer and model
model_id =  "tiiuae/falcon-rw-1b"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto", load_in_4bit=True, torch_dtype="auto")

# Tokenize
def preprocess(example):
    prompt = f"<start_of_turn>user\n{example['instruction']}<end_of_turn>\n<start_of_turn>model\n{example['output']}<end_of_turn>"
    return tokenizer(prompt, truncation=True, padding="max_length", max_length=512)

tokenized_dataset = dataset.map(preprocess)

# Apply LoRA
lora_config = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"], lora_dropout=0.1, task_type=TaskType.CAUSAL_LM)
model = get_peft_model(model, lora_config)

# Training
args = TrainingArguments(
    output_dir="./calendar-gemma-lora",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    save_strategy="epoch",
    logging_steps=10,
)

trainer = Trainer(model=model, args=args, train_dataset=tokenized_dataset["train"])
trainer.train()
