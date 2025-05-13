# Coding Prompts for YouTube: https://www.youtube.com/watch?v=pfap4wLUjTc
(Generated: 2025-05-11T16:30:19.776Z)

1. Summarize the main goal of the project: The video discusses the importance of including toxic data in the pre-training phase of language models (LLMs) to improve their ability to detect and handle toxic content. It explains that filtering out all toxic data can hinder the model's performance, as it fails to learn how to recognize and separate toxic features. The video highlights a study from Harvard University that shows how adding a small percentage of toxic data during pre-training helps in creating clearer, linearly separable representations of toxic features in the model's activation space. This allows for better control and suppression of toxic outputs during inference using techniques like Inference Time Intervention (ITI).
2. List and explain the key concepts: Transformer architecture, Activation space, Pre-training data contamination, Toxic feature representation, Linear separability, Inference Time Intervention (ITI), Supervised fine-tuning, Reinforcement learning alignment
3. Implement step 1: Understand the classical training algorithm for LLMs, including pre-training, supervised fine-tuning, and reinforcement learning alignment.
4. Implement step 2: Recognize the limitations of using only clean data in pre-training, as it prevents the model from learning to detect toxic patterns.
5. Implement step 3: Incorporate a small percentage (10-20%) of toxic data into the pre-training corpus to help the model learn and disentangle toxic features.
6. Implement step 4: Analyze the model's activation space to identify and isolate toxic feature representations as distinct, linearly separable directions.
7. Implement step 5: Apply Inference Time Intervention (ITI) during inference to steer the model's activations away from toxic subspaces, reducing toxic outputs.
8. Implement step 6: Evaluate the model's performance using benchmarks like the Toxicity dataset to measure the effectiveness of the approach.
9. Implement step 7: Consider the holistic design of the LLM pipeline, ensuring that pre-training and post-training processes work together to improve model behavior.
10. After implementing, suggest improvements or extensions to the project.